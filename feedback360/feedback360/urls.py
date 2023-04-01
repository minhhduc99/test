
New chat


ductiencat99@gmail.com
Hi, bạn có biết có nơi nào bán giá để mấy chai nước hoa 10ml không

Xin lỗi, nhưng tôi không thể cung cấp thông tin về các cửa hàng bán lẻ cụ thể hoặc giá cả cụ thể của sản phẩm. Giá của một chai nước hoa có thể khác nhau tùy thuộc vào thương hiệu, chất lượng, dung tích




ductiencat99@gmail.com
Hi, tôi có dự án django có model Question gồm 2 field question_name và question_content dùng để chứa thông tin câu hỏi. Tôi muốn tạo 1 api để import question từ file csv và lưu vào model Question. Trong file csv gồm 2 cột là name và content. 

Để tạo một API để import câu hỏi từ file CSV và lưu vào model Question trong Django, bạn có thể làm như sau:

Tạo một view trong file views.py của ứng dụng Django của bạn để xử lý yêu cầu của API. Bạn có thể sử dụng thư viện pandas để đọc dữ liệu từ file CSV.
python
Copy code
import pandas as pd
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Question


class QuestionImportAPIView(APIView):
    def post(self, request):
        file = request.FILES.get('file')
        if file is None:
            return Response({'message': 'File not found.'}, status=400)

        df = pd.read_csv(file)
        questions = []
        for index, row in df.iterrows():
            question = Question(question_name=row['name'], question_content=row['content'])
            questions.append(question)
        Question.objects.bulk_create(questions)

        return Response({'message': 'Questions imported successfully.'}, status=200)
Tạo một URL cho API trong file urls.py của ứng dụng Django của bạn.
python
Copy code
from django.urls import path
from .views import QuestionImportAPIView

urlpatterns = [
    path('import-questions/', QuestionImportAPIView.as_view(), name='import-questions'),
]
Sử dụng thư viện requests để gửi yêu cầu POST đến URL của API với file CSV được gửi trong request.
python
Copy code
import requests

url = 'http://localhost:8000/api/import-questions/'
file_path = 'path/to/your/file.csv'
files = {'file': open(file_path, 'rb')}

response = requests.post(url, files=files)
print(response.json())
Chú ý rằng, ở đây tôi sử dụng thư viện django-rest-framework để xây dựng API và yêu cầu phải được gửi với phương thức POST và chứa một file CSV có tên là 'file'. Bạn cần cài đặt thư viện này nếu chưa có và thêm nó vào INSTALLED_APPS trong file settings.py của ứng dụng Django của bạn.




ductiencat99@gmail.com
Thanks, để tôi thử

Rất vui khi có thể giúp bạn. Nếu bạn gặp bất kỳ vấn đề gì khi triển khai, hãy đặt câu hỏi cho tôi.




ductiencat99@gmail.com
Hi, vẫn project trên tôi có 1 model Feedback để lưu thông tin feedback gồm các field là name, question, comment. Tôi muốn tạo 1 view để export tất cả feedback ra 1 file pdf

Để tạo một view để xuất tất cả các phản hồi (feedback) thành một tập tin PDF, bạn có thể làm như sau:

Cài đặt các package cần thiết:
bash
Copy code
pip install reportlab
Tạo một view trong file views.py của ứng dụng Django của bạn để xử lý yêu cầu xuất ra PDF. Trong view này, bạn có thể sử dụng thư viện ReportLab để tạo file PDF và truy vấn các phản hồi từ model Feedback.
python
Copy code
from django.http import HttpResponse
from django.views.generic import View
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle
from .models import Feedback


class FeedbackPDFView(View):
    def get(self, request):
        # Lấy tất cả các phản hồi từ model Feedback
        feedbacks = Feedback.objects.all()

        # Tạo tập tin PDF và đặt tên file là feedbacks.pdf
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="feedbacks.pdf"'
        doc = SimpleDocTemplate(response, pagesize=letter)

        # Tạo một bảng để hiển thị các phản hồi
        elements = []
        styles = getSampleStyleSheet()
        table_style = TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 14),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
            ('ALIGN', (0, 1), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 12),
            ('BOTTOMPADDING', (0, 1), (-1, -1), 6),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ])
        data = [['Name', 'Question', 'Comment']]
        for feedback in feedbacks:
            data.append([feedback.name, feedback.question, feedback.comment])
        table = Table(data, colWidths=[2*inch, 3*inch, 5*inch])
        table.setStyle(table_style)

        # Thêm bảng vào tập tin PDF
        elements.append(table)

        # Tạo tập tin PDF và trả về response
        doc.build(elements)
        return response
Thêm một đường dẫn trong file urls.py để gọi view này.
python
Copy code
from django.urls import path

----------------------------------------------------------
Lưu file csv trong excel (CSV utf-8(comma delimited))
from django.shortcuts import render
from django.http import HttpResponse
from datetime import datetime
from rest_framework import views
import csv

from django.core.files.base import ContentFile
from django.core.files.storage import FileSystemStorage

from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Person

fs = FileSystemStorage(location='tmp/')
# Create your views here.


def index(request):
    return render(request, 'my_app/welcome.html', {'today': datetime.today()})


class PersonSerializer(serializers.Serializer):
    class Meta:
        model = Person
        fields = '__all__'


class PersonImport(viewsets.ModelViewSet):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer

    @action(detail=False, methods=['POST'])
    def upload_data(self, request):
        """Upload data from CSV"""
        file = request.FILES.get("file")
        # file = request.FILES["file"]
        content = file.read()  # these are bytes
        file_content = ContentFile(content)
        file_name = fs.save(
            "_tmp.csv", file_content
        )
        tmp_file = fs.path(file_name)

        csv_file = open(tmp_file, errors="ignore")
        reader = csv.reader(csv_file)
        next(reader)

        person_list = []
        for row in reader:
            (
                first_name,
                last_name
            ) = row
            person_list.append(
                Person(
                    first_name=first_name,
                    last_name=last_name
                )
            )

        Person.objects.bulk_create(person_list)

        return Response("Successfully upload the data")
    # edit thêm view confirm upload
-------------------------------------------------------------
