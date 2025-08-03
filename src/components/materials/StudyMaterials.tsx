import React, { useState } from 'react';
import { BookOpen, FileText, Video, Gamepad2, Clock, BookMarked, Search } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { StudyMaterial } from '../../types';

// Mock study materials data
const mockStudyMaterials: StudyMaterial[] = [
  {
    id: "1",
    userId: "user-1",
    title: "Cell Biology Essentials",
    type: "short_notes",
    content: "Key concepts in cell biology...",
    sourceDocumentId: "doc-1",
    createdAt: "2023-04-10T14:30:00Z"
  },
  {
    id: "2",
    userId: "user-1",
    title: "Comprehensive Cell Structure and Function",
    type: "long_notes",
    content: "Detailed explanation of cell structures...",
    sourceDocumentId: "doc-1",
    createdAt: "2023-04-10T15:00:00Z"
  },
  {
    id: "3",
    userId: "user-1",
    title: "Visual Guide to Cellular Processes",
    type: "video",
    content: "Video URL...",
    sourceDocumentId: "doc-1",
    createdAt: "2023-04-11T10:15:00Z"
  },
  {
    id: "4",
    userId: "user-1",
    title: "Cell Explorer: Interactive Learning",
    type: "game",
    content: "Game data...",
    sourceDocumentId: "doc-1",
    createdAt: "2023-04-12T09:45:00Z"
  },
  {
    id: "5",
    userId: "user-1",
    title: "Introduction to Photosynthesis",
    type: "short_notes",
    content: "Brief overview of photosynthesis...",
    sourceDocumentId: "doc-2",
    createdAt: "2023-04-15T11:20:00Z"
  }
];

const StudyMaterials: React.FC = () => {
  const [materials, setMaterials] = useState<StudyMaterial[]>(mockStudyMaterials);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  const materialTypes = [
    { id: 'short_notes', name: 'Short Notes', icon: <FileText size={20} /> },
    { id: 'long_notes', name: 'Long Notes', icon: <BookOpen size={20} /> },
    { id: 'video', name: 'Videos', icon: <Video size={20} /> },
    { id: 'game', name: 'Interactive', icon: <Gamepad2 size={20} /> },
  ];
  
  const filteredMaterials = materials.filter(material => {
    const matchesSearch = searchQuery === '' || material.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === null || material.type === selectedType;
    return matchesSearch && matchesType;
  });
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'short_notes':
        return <FileText size={20} />;
      case 'long_notes':
        return <BookOpen size={20} />;
      case 'video':
        return <Video size={20} />;
      case 'game':
        return <Gamepad2 size={20} />;
      default:
        return <FileText size={20} />;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Study Materials</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Browse your personalized learning materials converted from PDFs.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-2/3">
          <Input
            placeholder="Search materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search size={18} />}
          />
        </div>
        
        <div className="flex flex-wrap gap-2 w-full sm:w-1/3">
          {materialTypes.map((type) => (
            <Button
              key={type.id}
              variant={selectedType === type.id ? 'primary' : 'outline'}
              size="sm"
              icon={type?.icon}
              onClick={() => setSelectedType(selectedType === type.id ? null : type.id)}
            >
              {type.name}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.length > 0 ? (
          filteredMaterials.map((material) => (
            <Card key={material.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className={`
                  h-2 w-full rounded-t-xl
                  ${material.type === 'short_notes' ? 'bg-blue-500' : 
                   material.type === 'long_notes' ? 'bg-purple-500' : 
                   material.type === 'video' ? 'bg-red-500' : 'bg-green-500'}
                `}></div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className={`
                      p-2 rounded-full text-white
                      ${material.type === 'short_notes' ? 'bg-blue-500' : 
                       material.type === 'long_notes' ? 'bg-purple-500' : 
                       material.type === 'video' ? 'bg-red-500' : 'bg-green-500'}
                    `}>
                      {getTypeIcon(material.type)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Clock size={14} className="mr-1" />
                      {formatDate(material.createdAt)}
                    </div>
                  </div>
                  
                  <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {material.title}
                  </h3>
                  
                  <div className="flex items-center mt-4 justify-between">
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                      {material.type === 'short_notes' ? 'Short Notes' : 
                       material.type === 'long_notes' ? 'Long Notes' : 
                       material.type === 'video' ? 'Video' : 'Interactive'}
                    </span>
                    <Button variant="ghost" size="sm" icon={<BookMarked size={16} />}>
                      Open
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-12 text-center">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
              <Search size={32} className="text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No materials found</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Try adjusting your search or filters, or convert a new document.
            </p>
            <Button className="mt-4">
              Convert New Document
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyMaterials;