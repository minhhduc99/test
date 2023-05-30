class ListBatch(views.APIView):
    pagination_class = BasePagination
    serializer_class = BatchSerializer
    @property
    def paginator(self):
        if not hasattr(self, '_paginator'):
            if self.pagination_class is None:
                self._paginator = None
            else:
                self._paginator = self.pagination_class()
        else:
            pass
        return self._paginator
    def paginate_queryset(self, queryset):
        
        if self.paginator is None:
            return None
        return self.paginator.paginate_queryset(queryset,
                   self.request, view=self)
    def get_paginated_response(self, data):
        assert self.paginator is not None
        return self.paginator.get_paginated_response(data)
    
    @extend_schema(
        responses={200: BatchSerializer},
        description="Description API: List all feedback batches"
    )
    def get(self, request, format=None):
        instance = Batch.objects.all()
        page = self.paginate_queryset(instance)
        if page is not None:
            serializer = self.get_paginated_response(self.serializer_class(page,
                many=True).data)
        else:
            serializer = self.serializer_class(instance, many=True)
        context = {
            "message": "Listed Successfully",
            "status": status.HTTP_200_OK,
            "data": serializer.data,
            "errors": None
        }
        return Response(context)
