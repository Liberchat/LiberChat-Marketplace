import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, StickyNote } from 'lucide-react';
import { Contact } from '../types';

interface ContactFormProps {
  contact?: Contact | null;
  onSubmit: (contact: Omit<Contact, 'id'>) => void;
  onCancel: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({
  contact,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    note: '',
  });

  useEffect(() => {
    if (contact) {
      setFormData({
        firstName: contact.firstName || '',
        lastName: contact.lastName || '',
        phone: contact.phone || '',
        email: contact.email || '',
        note: contact.note || '',
      });
    }
  }, [contact]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md border-2 border-red-600">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-black">
            {contact ? 'Modifier le contact' : 'Nouveau contact'}
          </h2>
          <button
            onClick={onCancel}
            className="text-red-600 hover:text-black transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-black mb-2">
              Prénom *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-600" />
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 bg-white border-2 border-red-600 rounded-lg text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Prénom"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-2">
              Nom *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-600" />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 bg-white border-2 border-red-600 rounded-lg text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Nom"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-2">
              Téléphone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-600" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 bg-white border-2 border-red-600 rounded-lg text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="06 12 34 56 78"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-600" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 bg-white border-2 border-red-600 rounded-lg text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="email@exemple.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-2">
              Note
            </label>
            <div className="relative">
              <StickyNote className="absolute left-3 top-3 h-4 w-4 text-red-600" />
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                rows={3}
                className="w-full pl-10 pr-4 py-2 bg-white border-2 border-red-600 rounded-lg text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Note personnelle..."
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2 px-4 bg-black text-white border-2 border-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-red-600 text-white border-2 border-white rounded-lg hover:bg-red-700 transition-colors font-bold"
            >
              {contact ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;