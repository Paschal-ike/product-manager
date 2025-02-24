from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Product
from .serializers import ProductSerializers

def product_list(request):
    return render(request, 'product_list.html')

class ProductListCreateView(APIView):
    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializers(products, many=True)
        return Response({'messag':'All items retrieved',
                         'data': serializer.data}, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = ProductSerializers(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"mesaage": 'Product Created Successfully',
                             'data': serializer.data}, status=status.HTTP_201_CREATED)
        print("Validation Errors:", serializer.errors)
        return Response({
            'message': 'Invalid data',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    

class ProductRetrieveUpdateDestroy(APIView):
    def get_object(self, pk):
        try:
            return Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return None
    
    def get(self, request, pk):
        product = self.get_object(pk)
        if product is None:
            return Response({'message': 'Product not found!'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ProductSerializers(product)
        return Response({"message": "Product retrieved Successfully",
                         'data': serializer.data}, status=status.HTTP_200_OK)
    
    def put(self, request, pk):
        product = self.get_object(pk)
        if product is None:
            return Response ({'message':'Product not found!'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ProductSerializers(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response ({'message': "Product updated successfully!",
                              'data': serializer.data}, status=status.HTTP_200_OK)
        return Response({'message': 'Invalid data',
                         'errors':serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        product = self.get_object(pk)
        if product is None:
            return Response({'message': "Product not Found"}, status=status.HTTP_404_NOT_FOUND)
        product.delete()
        return Response({'message': 'Product deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

        

                        