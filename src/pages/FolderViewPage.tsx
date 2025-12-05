import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface StorageFile {
  id: number;
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
  uploaded_at: string;
}

const FolderViewPage = () => {
  const navigate = useNavigate();
  const { folderId } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [folderName, setFolderName] = useState('');
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<StorageFile | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<StorageFile | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/');
      return;
    }
    loadFiles();
  }, [navigate, folderId]);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://functions.poehali.dev/638aafd1-510b-4b00-beee-28346540e190?folder_id=${folderId}`);
      
      if (!response.ok) throw new Error('Ошибка загрузки файлов');
      
      const data = await response.json();
      setFiles(data.files || []);
      setFolderName(data.folder_name || '');
    } catch (error) {
      toast.error('Не удалось загрузить файлы');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Файл слишком большой. Максимум 50 МБ');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder_id', folderId!);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          toast.success('Файл загружен');
          loadFiles();
          if (fileInputRef.current) fileInputRef.current.value = '';
        } else {
          const error = JSON.parse(xhr.responseText);
          toast.error(error.error || 'Ошибка загрузки файла');
        }
        setUploading(false);
        setUploadProgress(0);
      });

      xhr.addEventListener('error', () => {
        toast.error('Ошибка загрузки файла');
        setUploading(false);
        setUploadProgress(0);
      });

      xhr.open('POST', 'https://functions.poehali.dev/cbbbbc82-61fa-4061-88d0-900cb586aea6');
      xhr.send(formData);

    } catch (error: any) {
      toast.error(error.message);
      console.error(error);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteFile = async () => {
    if (!selectedFile) return;

    try {
      const response = await fetch('https://functions.poehali.dev/638aafd1-510b-4b00-beee-28346540e190', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          file_id: selectedFile.id
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Ошибка удаления файла');
      }

      toast.success('Файл удален');
      setIsDeleteDialogOpen(false);
      setSelectedFile(null);
      loadFiles();
    } catch (error: any) {
      toast.error(error.message);
      console.error(error);
    }
  };

  const openDeleteDialog = (file: StorageFile) => {
    setSelectedFile(file);
    setIsDeleteDialogOpen(true);
  };

  const openPreview = (file: StorageFile) => {
    setPreviewFile(file);
    setIsPreviewOpen(true);
  };

  const isPreviewable = (fileType: string): boolean => {
    return fileType.startsWith('image/') || 
           fileType.startsWith('video/') || 
           fileType.startsWith('audio/') ||
           fileType === 'application/pdf' ||
           fileType === 'text/plain' ||
           fileType === 'text/html';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' Б';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' КБ';
    return (bytes / (1024 * 1024)).toFixed(1) + ' МБ';
  };

  const getFileIcon = (fileType: string): string => {
    if (fileType.startsWith('image/')) return 'Image';
    if (fileType.startsWith('video/')) return 'Video';
    if (fileType.startsWith('audio/')) return 'Music';
    if (fileType.includes('pdf')) return 'FileText';
    if (fileType.includes('word') || fileType.includes('document')) return 'FileText';
    if (fileType.includes('sheet') || fileType.includes('excel')) return 'Sheet';
    if (fileType.includes('html')) return 'Code';
    return 'File';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/storage')}
              variant="outline"
              className="border-yellow-600/50 text-yellow-500 hover:bg-yellow-600/10"
            >
              <Icon name="ArrowLeft" size={20} className="mr-2" />
              Назад
            </Button>
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-3 rounded-xl shadow-lg">
                <Icon name="Folder" size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{folderName}</h1>
                <p className="text-slate-400 text-sm">{files.length} файлов</p>
              </div>
            </div>
          </div>
          <Button
            onClick={handleFileSelect}
            disabled={uploading}
            className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white"
          >
            <Icon name="Upload" size={20} className="mr-2" />
            {uploading ? 'Загрузка...' : 'Загрузить файл'}
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          className="hidden"
          accept="*/*"
        />

        {uploading && (
          <Card className="bg-slate-800/50 border-yellow-600/30 p-6 mb-6">
            <div className="flex items-center gap-4">
              <Icon name="Upload" size={24} className="text-yellow-500" />
              <div className="flex-1">
                <p className="text-white mb-2">Загрузка файла... {uploadProgress}%</p>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            </div>
          </Card>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
          </div>
        ) : files.length === 0 ? (
          <Card className="bg-slate-800/50 border-yellow-600/30 p-12 text-center">
            <Icon name="FileX" size={64} className="mx-auto text-slate-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Файлов пока нет</h3>
            <p className="text-slate-400 mb-6">Загрузите первый файл в эту папку</p>
            <Button
              onClick={handleFileSelect}
              className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white"
            >
              <Icon name="Upload" size={20} className="mr-2" />
              Загрузить файл
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {files.map((file) => (
              <Card
                key={file.id}
                onClick={() => isPreviewable(file.file_type) && openPreview(file)}
                className="group relative overflow-hidden bg-slate-800/50 border-yellow-600/30 hover:border-yellow-600 transition-all cursor-pointer"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-4 rounded-xl shadow-lg">
                      <Icon name={getFileIcon(file.file_type)} size={32} className="text-white" />
                    </div>
                    <div className="flex gap-2">
                      {isPreviewable(file.file_type) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            openPreview(file);
                          }}
                        >
                          <Icon name="Eye" size={20} />
                        </Button>
                      )}
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          const link = document.createElement('a');
                          link.href = file.file_url;
                          link.download = file.file_name;
                          link.click();
                        }}
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:text-yellow-500 hover:bg-yellow-500/10"
                      >
                        <Icon name="Download" size={20} />
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteDialog(file);
                        }}
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Icon name="Trash2" size={20} />
                      </Button>
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 truncate" title={file.file_name}>
                    {file.file_name}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{formatFileSize(file.file_size)}</span>
                    <span>{new Date(file.uploaded_at).toLocaleDateString('ru-RU')}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-slate-800 border-red-600/30">
          <DialogHeader>
            <DialogTitle className="text-white">Удалить файл?</DialogTitle>
            <DialogDescription className="text-slate-400">
              Вы уверены, что хотите удалить файл "{selectedFile?.file_name}"? 
              Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedFile(null);
              }}
              className="border-slate-600 text-slate-300"
            >
              Отмена
            </Button>
            <Button
              onClick={handleDeleteFile}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="bg-slate-900 border-yellow-600/30 max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-white">{previewFile?.file_name}</DialogTitle>
            <DialogDescription className="text-slate-400">
              {previewFile && formatFileSize(previewFile.file_size)} • {previewFile?.file_type}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 overflow-auto max-h-[70vh]">
            {previewFile && (
              <>
                {previewFile.file_type.startsWith('image/') && (
                  <img 
                    src={previewFile.file_url} 
                    alt={previewFile.file_name}
                    className="w-full h-auto rounded-lg"
                  />
                )}
                {previewFile.file_type.startsWith('video/') && (
                  <video 
                    src={previewFile.file_url} 
                    controls
                    className="w-full rounded-lg"
                  >
                    Ваш браузер не поддерживает видео
                  </video>
                )}
                {previewFile.file_type.startsWith('audio/') && (
                  <audio 
                    src={previewFile.file_url} 
                    controls
                    className="w-full"
                  >
                    Ваш браузер не поддерживает аудио
                  </audio>
                )}
                {previewFile.file_type === 'application/pdf' && (
                  <iframe
                    src={previewFile.file_url}
                    className="w-full h-[600px] rounded-lg"
                    title={previewFile.file_name}
                  />
                )}
                {(previewFile.file_type === 'text/plain' || previewFile.file_type === 'text/html') && (
                  <iframe
                    src={previewFile.file_url}
                    className="w-full h-[600px] rounded-lg bg-white"
                    title={previewFile.file_name}
                  />
                )}
              </>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPreviewOpen(false)}
              className="border-slate-600 text-slate-300"
            >
              Закрыть
            </Button>
            <Button
              onClick={() => {
                if (previewFile) {
                  const link = document.createElement('a');
                  link.href = previewFile.file_url;
                  link.download = previewFile.file_name;
                  link.click();
                }
              }}
              className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white"
            >
              <Icon name="Download" size={20} className="mr-2" />
              Скачать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FolderViewPage;