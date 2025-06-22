// app/unauthorized/page.tsx
export default function UnauthorizedPage() {
    return (
      <div className="text-center mt-20 min-h-screen">
        <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
        <p className="text-gray-600">You do not have permission to view this page.</p>
      </div>
    );
  }
  