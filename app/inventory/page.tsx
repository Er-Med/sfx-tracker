import Pagination from "@/components/Pagination";
import Sidebar from "@/components/Sidebar";
import { deleteProduct } from "@/lib/actions/products";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function InventoryPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string; }>; }) {

 // Get authenticated user - redirects to sign-in if not logged in
 const user = await getCurrentUser();
 const userId = user.id;

 // Extract search and pagination parameters from URL
 const params = await searchParams;
 const q = (params.q ?? "").trim(); // Search query
 const page = Math.max(Number(params.page ?? 1)); // Current page number
 const pageSize = 5; // Items per page

 // Build database query conditions
 const where = {
  userId, // Only show products belonging to current user
  name: { contains: q, mode: "insensitive" as const } // Case-insensitive name search
 };

 // Fetch total count and paginated items in parallel for better performance
 const [totalCount, items] = await Promise.all([
  prisma.product.count({ where }),
  prisma.product.findMany({
   where,
   orderBy: { createdAt: "desc" }, // Show newest products first
   skip: (page - 1) * pageSize, // Calculate offset for pagination
   take: pageSize // Limit results per page
  })
 ]);

 // Calculate total pages for pagination component
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
     {/* Search Form - submits to same page with GET method */}
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

     {/* Products Table */}
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
           {product.sku || "-"} {/* Show dash if no SKU */}
          </td>
          <td className="table-td">
           ${Number(product.price).toFixed(2)} {/* Format price to 2 decimal places */}
          </td>
          <td className="table-td">
           {product.quantity}
          </td>
          <td className="table-td">
           {product.lowStock || "-"} {/* Show dash if no low stock threshold */}
          </td>
          <td className="table-td">
           {/* Server action form for deleting products */}
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

      {/* Show pagination only if there are multiple pages */}
      {totalPages > 1 && (
       <div className="bg-white rounded-lg border border-gray-200 p-6">
        <Pagination currentPage={page}
         totalPages={totalPages}
         baseUrl="/inventory"
         searchParams={{ q, pageSize: String(pageSize) }} />
       </div>
      )}
     </div>
    </div>
   </main>
  </div>
 );
}