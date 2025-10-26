import Sidebar from "@/components/Sidebar";
import { getCurrentUser } from "@/lib/auth";
import { AccountSettings } from "@stackframe/stack";

export default async function SettingsPpage() {
 const user = await getCurrentUser();

 return (
  <div>
   <Sidebar currentPath='/settings' />
   <main className='ml-64 p-8'>
    <div className='mb-8'>
     <div className='flex items-center justify-between'>
      <div>
       <h1 className='text-2xl font-semibold text-gray-900'>
        Add Product
       </h1>
       <p className='text-sm text-gray-500'>
        Add a new Product to your inventory
       </p>
      </div>
     </div>
    </div>

    <div className="max-w-6xl">
     <div className="bg-white rounded-lg border-gray-200 p-6">
      <AccountSettings fullPage />
     </div>
    </div>
   </main>
  </div>
 );
}