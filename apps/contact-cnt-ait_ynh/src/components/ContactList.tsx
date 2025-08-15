import React from 'react';
import { Edit3, Trash2, Share2, User, Phone, Mail, StickyNote } from 'lucide-react';
import { Contact } from '../types';

interface ContactListProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (id: number) => void;
  onShare: (contact: Contact) => void;
}

const ContactList: React.FC<ContactListProps> = ({
  contacts,
  onEdit,
  onDelete,
  onShare,
}) => {
  if (contacts.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">Aucun contact</h3>
        <p className="text-gray-300">Commencez par ajouter votre premier contact.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {contacts.map((contact) => (
        <div
          key={contact.id}
          className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow border-2 border-red-600"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-black mb-1">
                {contact.firstName} {contact.lastName}
              </h3>
              <div className="space-y-2">
                {contact.phone && (
                  <div className="flex items-center text-sm text-black">
                    <Phone className="h-4 w-4 mr-2 text-red-600" />
                    {contact.phone}
                  </div>
                )}
                {contact.email && (
                  <div className="flex items-center text-sm text-black">
                    <Mail className="h-4 w-4 mr-2 text-red-600" />
                    {contact.email}
                  </div>
                )}
                {contact.note && (
                  <div className="flex items-start text-sm text-black">
                    <StickyNote className="h-4 w-4 mr-2 mt-0.5 text-red-600 flex-shrink-0" />
                    <span className="line-clamp-2">{contact.note}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(contact)}
              className="flex-1 flex items-center justify-center px-3 py-2 bg-black text-white border border-white rounded hover:bg-gray-900 transition-colors font-medium"
            >
              <Edit3 className="h-4 w-4 mr-1" />
              Modifier
            </button>
            <button
              onClick={() => onShare(contact)}
              className="flex-1 flex items-center justify-center px-3 py-2 bg-red-600 text-white border border-white rounded hover:bg-red-700 transition-colors font-medium"
            >
              <Share2 className="h-4 w-4 mr-1" />
              Partager
            </button>
            <button
              onClick={() => onDelete(contact.id)}
              className="flex items-center justify-center px-3 py-2 bg-black text-white rounded hover:bg-gray-900 transition-colors border-2 border-red-600 font-medium"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;