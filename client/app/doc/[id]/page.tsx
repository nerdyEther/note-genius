'use client'

import Document from "@/components/Document"

interface DocumentPageProps {
  params: {
    id: string;
  };
}

function DocumentPage({ params }: DocumentPageProps) {
  console.log("page is loading");
  const { id } = params;
  console.log(params);
  
  return (
    <div className="flex flex-col flex-1 min-h-screen">
     
      <Document id={id} />
    </div>
  );
}

export default DocumentPage;
