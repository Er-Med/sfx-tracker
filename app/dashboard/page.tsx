import Sidebar from "@/components/Sidebar";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TrendingUp } from "lucide-react";

async function DashboardPage() {
 const user = await getCurrentUser();
 const userId = user.id;

 const [totalProducts, lowStock, allProducts] = await Promise.all([
  prisma.product.count({ where: { userId } }),
  prisma.product.count({
   where: {
    userId,
    lowStock: { not: null },
    quantity: { lte: 5 }
   }
  }),
  prisma.product.findMany({
   where: { userId },
   select: { price: true, quantity: true, createdAt: true },
  }),
 ])

 const totalValue = allProducts.reduce((sum, product) => sum + Number(product.price) * Number(product.quantity), 0)


 // const totalProducts = await prisma.product.count({ where: { userId } })
 // const lowStock = await prisma.product.count({
 //  where: {
 //   userId,
 //   lowStockAt: { not: null },
 //   quantity: { lte: 5 }
 //  }
 // })

 const recentProducts = await prisma.product.findMany({
  where: { userId },
  orderBy: { createdAt: "desc" },
  take: 5
 })

 // const allProducts = await prisma.product.findMany({
 //  where: { userId },
 //  select: { price: true, quantity: true, createdAt: true }
 // })


 // console.log(totalValue);

 return (
  <div className="min-h-screen bg-gray-50">
   <Sidebar currentPath="/dashboard" />
   <main className="ml-64 p-8">
    {/* Header */}
    <div className="mb-8">
     <div className="flex justify-between items-center">
      <div>
       <h1 className="flex items-center justify-between">Dashboard</h1>
       <p className="text-sm text-gray-500">Welcome back, ovorebviwe of your inentry</p>
      </div>
     </div>
    </div>

    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
     {/* Key Metrics */}
     <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
       Key Metrics
      </h2>
      <div className="grid grid-cols-3 gap-6">

       <div className="text-center">
        <div className="text-3xl font-bold text-gray-900">
         {totalProducts}
        </div>
        <div className="text-sm text-gray-600">Total Products</div>
        <div className="flex items-center justify-center mt-1">
         <span className="text-xs text-green-600">
          +{totalProducts}
         </span>
         <TrendingUp className="w-3 h-3 text-green-600 ml-1" />
        </div>
       </div>

       <div className="text-center">
        <div className="text-3xl font-bold text-gray-900">
         {Number(totalValue).toFixed(0)}
        </div>
        <div className="text-sm text-gray-600">Total Value</div>
        <div className="flex items-center justify-center mt-1">
         <span className="text-xs text-green-600">
          +{Number(totalValue).toFixed(0)}
         </span>
         <TrendingUp className="w-3 h-3 text-green-600 ml-1" />
        </div>
       </div>

       <div className="text-center">
        <div className="text-3xl font-bold text-gray-900">
         {totalProducts}
        </div>
        <div className="text-sm text-gray-600">Low Stock</div>
        <div className="flex items-center justify-center mt-1">
         <span className="text-xs text-green-600">
          +{lowStock}
         </span>
         <TrendingUp className="w-3 h-3 text-green-600 ml-1" />
        </div>
       </div>
      </div>
     </div>
    </section>

    {/* Stockc Levele  */}
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
     <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
       <h2 className="text-lg font-semibold text-gray-900">
        Stock Levels
       </h2>
      </div>
      <div className="space-y-3">
       {recentProducts.map((product, key) => {
        const stockLevel = product.quantity === 0
         ? 0
         : product.quantity <= (product.lowStock || 5)
          ? 1
          : 2;

        const bgColors = [
         "bg-red-600",
         "bg-yellow-600",
         "bg-green-600",
        ];
        const textColors = [
         "text-red-600",
         "text-yellow-600",
         "text-green-600",
        ];

        return (
         <div key={key} className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
          <div className="flex items-center gap-x-3">
           <div className={`w-3 h-3 rounded-full ${bgColors[stockLevel]}`} />
           <span className="text-sm font-meduim text-gray-900">{product.name}</span>
          </div>
          <div className={`text-sm font-meduim ${textColors[stockLevel]}`}
          >
           {product.quantity} units</div>
         </div>
        )
       })}
      </div>
     </div>
    </section>
   </main>
  </div>
 );
}

export default DashboardPage;