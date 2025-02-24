from rest_framework import serializers
from .models import Product

class ProductSerializers(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

    def validate_price(self, value):
        """
        Ensure the price is not negative.
        """
        if value < 0:
            raise serializers.ValidationError("Price cannot be negative.")
        return value

    def validate_stock_now(self, value):
        """
        Ensure the stock count is not negative.
        """
        if value < 0:
            raise serializers.ValidationError("Stock count cannot be negative.")
        return value