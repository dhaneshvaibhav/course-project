import React, { useEffect, useState } from 'react';
import { PlusCircle, Trash2, Edit2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CourseType } from '../types';
import toast from 'react-hot-toast';

export default function CourseTypes() {
  const [courseTypes, setCourseTypes] = useState<CourseType[]>([]);
  const [newTypeName, setNewTypeName] = useState('');
  const [editingType, setEditingType] = useState<CourseType | null>(null);

  useEffect(() => {
    loadCourseTypes();
  }, []);

  async function loadCourseTypes() {
    const { data, error } = await supabase
      .from('course_types')
      .select('*')
      .order('name');
    
    if (error) {
      toast.error('Failed to load course types');
      return;
    }
    
    setCourseTypes(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (editingType) {
      const { error } = await supabase
        .from('course_types')
        .update({ name: newTypeName })
        .eq('id', editingType.id);

      if (error) {
        toast.error('Failed to update course type');
        return;
      }

      toast.success('Course type updated successfully');
      setEditingType(null);
    } else {
      const { error } = await supabase
        .from('course_types')
        .insert([{ name: newTypeName }]);

      if (error) {
        toast.error('Failed to create course type');
        return;
      }

      toast.success('Course type created successfully');
    }

    setNewTypeName('');
    loadCourseTypes();
  }

  async function handleDelete(id: string) {
    const { error } = await supabase
      .from('course_types')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete course type');
      return;
    }

    toast.success('Course type deleted successfully');
    loadCourseTypes();
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Course Types</h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={newTypeName}
            onChange={(e) => setNewTypeName(e.target.value)}
            placeholder="Enter course type name"
            className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <PlusCircle size={20} />
            {editingType ? 'Update' : 'Add'} Type
          </button>
        </div>
      </form>

      <div className="bg-white rounded-lg shadow">
        <ul className="divide-y">
          {courseTypes.map((type) => (
            <li key={type.id} className="flex items-center justify-between p-4">
              <span className="text-lg">{type.name}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingType(type);
                    setNewTypeName(type.name);
                  }}
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleDelete(type.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}