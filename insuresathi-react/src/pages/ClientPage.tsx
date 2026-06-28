import InsuranceForm from "@/components/insurance-form/insurance-form";

export default function ClientPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">InsureSathi Form</h1>
        <p className="text-gray-600">Please fill out the details accurately so your agent can process your request.</p>
      </div>
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-xl p-6 md:p-10 border border-gray-100">
        <InsuranceForm isClientMode={true} />
      </div>
    </div>
  );
}
