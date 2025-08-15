import { Contact } from '../types';

const API_BASE_URL = '/contacts/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const contactService = {
  async getContacts(): Promise<Contact[]> {
    const response = await fetch(`${API_BASE_URL}/contacts`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erreur lors du chargement des contacts');
    }

    return response.json();
  },

  async createContact(contact: Omit<Contact, 'id'>): Promise<Contact> {
    const response = await fetch(`${API_BASE_URL}/contacts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(contact),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la création du contact');
    }

    return response.json();
  },

  async updateContact(id: number, contact: Omit<Contact, 'id'>): Promise<Contact> {
    const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(contact),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la mise à jour du contact');
    }

    return response.json();
  },

  async deleteContact(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la suppression du contact');
    }
  },

  async shareContact(id: number) {
    const response = await fetch(`${API_BASE_URL}/contacts/${id}/share`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors du partage du contact');
    }

    return response.json();
  },

  async getSharedContact(shareCode: string) {
    const response = await fetch(`/contacts/api/share/${shareCode}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors du chargement du contact partagé');
    }

    return response.json();
  },

  async exportContacts(): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/contacts/export`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'export des contacts');
    }

    return response.blob();
  },

  async importContacts(contacts: Contact[]): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/contacts/import`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ contacts }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de l\'import des contacts');
    }
  },
};