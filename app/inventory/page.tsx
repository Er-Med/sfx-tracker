import Sidebar from "@/components/Sidebar";
import { deleteProduct } from "@/lib/actions/products";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function InventoryPage({ searchParams }: { searchParams: Promise<{ q?: string; }>; }) {

 // Get all products
 const user = await getCurrentUser();
 const userId = user.id;


 const params = await searchParams;
 const q = (params.q ?? "").trim();

 // const totalProducts = await prisma.product.findMany({ where: { userId, name: { contains: q, mode: "insensitive" as const } } });

 const where = {
  userId,
  name: { contains: q, mode: "insensitive" as const }
 };

 const [totalCount, items] = await Promise.all([
  prisma.product.count({ where }),
  prisma.product.findMany({ where })
 ]);

 const pageSize = 10;

 const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

 return (

  <div className="min-h-screen bg-gray-50">
   <Sidebar currentPath="/inventory" />
   <main className="ml-64 p-8">
    <div className="mb-8">
     <div className="flex items-center justify-between">
      <div>
       <h1 className="text-2xl font-semibold text-gray-900">
        Inventory
       </h1>
       <p className="text-sm text-gray-500">
        Manage your products and track inventory levels.
       </p>
      </div>
     </div>
    </div>

    <div className="space-y-6">
     {/* Search */}
     <div className="bg-white rounded-lg border border-gray-200 p-6">
      <form className="flex gap-2" action="/inventory" method="GET">
       <input
        name="q"
        placeholder="Search products"
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
       />
       <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
        Search
       </button>
      </form>
     </div>

     {/* Product Table */}
     <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full">
       <thead className="bg-gray-50">
        <tr>
         <th className="table-th">Name</th>
         <th className="table-th">SKU</th>
         <th className="table-th">Price</th>
         <th className="table-th">Quantity</th>
         <th className="table-th">Low Stock</th>
         <th className="table-th">Actions</th>
        </tr>
       </thead>

       <tbody className="bg-white divide-y divide-gray-200">
        {items.map((product, key) => (
         <tr key={key} className="hover:ng-gray-50">
          <td className="table-td">
           {product.name}
          </td>
          <td className="table-td">
           {product.sku || "-"}
          </td>
          <td className="table-td">
           ${Number(product.price).toFixed(2)}
          </td>
          <td className="table-td">
           {product.quantity}
          </td>
          <td className="table-td">
           {product.lowStock || "-"}
          </td>
          <td className="table-td">
           <form action={async (formData: FormData) => {
            "use server";
            await deleteProduct(formData);
           }}>
            <input type="hidden" name="id" value={product.id} />
            <button className="text-red-600 hover:text-red-900">
             Delete
            </button>
           </form>
          </td>
         </tr>
        ))}
       </tbody>
      </table>


     </div>
    </div>
   </main>
  </div>
 );
}