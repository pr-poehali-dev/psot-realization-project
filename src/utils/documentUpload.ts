interface UploadDocumentParams {
  userId: string;
  department: string;
  documentType: string;
  file: File;
}

export async function uploadDocumentToStorage({
  userId,
  department,
  documentType,
  file
}: UploadDocumentParams): Promise<string> {
  const getFoldersResponse = await fetch(
    `https://functions.poehali.dev/89ba96e1-c10f-490a-ad91-54a977d9f798?user_id=${userId}`
  );
  const foldersData = await getFoldersResponse.json();

  let departmentFolderId;
  const departmentFolder = foldersData.folders?.find(
    (f: any) => f.folder_name === department
  );

  if (departmentFolder) {
    departmentFolderId = departmentFolder.id;
  } else {
    const createDeptResponse = await fetch(
      'https://functions.poehali.dev/89ba96e1-c10f-490a-ad91-54a977d9f798',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          user_id: userId,
          folder_name: department
        })
      }
    );
    const deptData = await createDeptResponse.json();
    departmentFolderId = deptData.folder_id;
  }

  let documentTypeFolderId;
  const documentTypeFolder = foldersData.folders?.find(
    (f: any) =>
      f.folder_name === documentType && f.parent_id === departmentFolderId
  );

  if (documentTypeFolder) {
    documentTypeFolderId = documentTypeFolder.id;
  } else {
    const createDocTypeResponse = await fetch(
      'https://functions.poehali.dev/89ba96e1-c10f-490a-ad91-54a977d9f798',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          user_id: userId,
          folder_name: documentType,
          parent_id: departmentFolderId
        })
      }
    );
    const docTypeData = await createDocTypeResponse.json();
    documentTypeFolderId = docTypeData.folder_id;
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder_id', documentTypeFolderId.toString());

  const uploadResponse = await fetch(
    'https://functions.poehali.dev/cbbbbc82-61fa-4061-88d0-900cb586aea6',
    {
      method: 'POST',
      body: formData
    }
  );

  const uploadData = await uploadResponse.json();
  return uploadData.file_url;
}
