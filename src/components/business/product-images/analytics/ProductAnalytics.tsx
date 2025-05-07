
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductImage } from '@/lib/api/product-api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface ProductAnalyticsProps {
  products: ProductImage[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ProductAnalytics: React.FC<ProductAnalyticsProps> = ({ products }) => {
  // Calculate analytics data
  const analyticsData = useMemo(() => {
    // Total number of products
    const totalProducts = products.length;
    
    // Active vs. Inactive
    const activeProducts = products.filter(p => p.is_active).length;
    const inactiveProducts = totalProducts - activeProducts;
    
    // Category distribution
    const categoryMap = new Map<string, number>();
    products.forEach(product => {
      const category = product.category || 'Uncategorized';
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });
    
    const categoryData = Array.from(categoryMap.entries()).map(([name, value]) => ({
      name,
      value
    }));
    
    // Products added per month
    const monthMap = new Map<string, number>();
    products.forEach(product => {
      if (product.created_at) {
        const date = new Date(product.created_at);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthMap.set(monthYear, (monthMap.get(monthYear) || 0) + 1);
      }
    });
    
    // Sort months chronologically
    const sortedMonths = Array.from(monthMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]));
    
    const monthlyData = sortedMonths.map(([month, count]) => ({
      month: month,
      count
    }));
    
    // Image optimization stats
    let totalOriginalSize = 0;
    let totalCompressedSize = 0;
    
    products.forEach(product => {
      if (product.original_size) {
        totalOriginalSize += product.original_size;
      }
      if (product.compressed_size) {
        totalCompressedSize += product.compressed_size;
      }
    });
    
    const savedBytes = totalOriginalSize - totalCompressedSize;
    const savingsPercentage = totalOriginalSize > 0 
      ? Math.round((savedBytes / totalOriginalSize) * 100) 
      : 0;
    
    return {
      totalProducts,
      activeProducts,
      inactiveProducts,
      categoryData,
      monthlyData,
      totalOriginalSize: formatBytes(totalOriginalSize),
      totalCompressedSize: formatBytes(totalCompressedSize),
      savedBytes: formatBytes(savedBytes),
      savingsPercentage
    };
  }, [products]);
  
  // Format bytes to KB, MB etc
  function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  if (products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Product Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No products available for analysis.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Product Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-2xl font-bold">{analyticsData.totalProducts}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-2xl font-bold">{analyticsData.activeProducts}</p>
            <p className="text-xs text-muted-foreground">
              {Math.round((analyticsData.activeProducts / analyticsData.totalProducts) * 100)}% of total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium">Storage Saved</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-2xl font-bold">{analyticsData.savedBytes}</p>
            <p className="text-xs text-muted-foreground">
              {analyticsData.savingsPercentage}% optimization
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-2xl font-bold">{analyticsData.categoryData.length}</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Products By Category</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {analyticsData.categoryData.length > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {analyticsData.categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip formatter={(value) => [`${value} products`, 'Count']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-muted-foreground">No category data available.</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Products Added Over Time</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {analyticsData.monthlyData.length > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analyticsData.monthlyData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 40,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      angle={-45} 
                      textAnchor="end"
                      tick={{ fontSize: 12 }}
                      height={60}
                    />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} products`, 'Added']} />
                    <Bar dataKey="count" name="Products Added" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-muted-foreground">No timeline data available.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductAnalytics;
