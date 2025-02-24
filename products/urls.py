from django.urls import path
from .views import ProductListCreateView, ProductRetrieveUpdateDestroy, product_list

urlpatterns = [
   
    path('products/', ProductListCreateView.as_view(), name='product-list-create'),
    path('products/<int:pk>/', ProductRetrieveUpdateDestroy.as_view(), name='product-retrieve-update-delete')
]