// src/pages/AuthorityPage.tsx
// src/pages/AuthorityManagement.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Authority {
    id: number;
    name: string;
    description: string;
}

const AuthorityManagement: React.FC = () => {
    const [authorities, setAuthorities] = useState<Authority[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editingAuthority, setEditingAuthority] = useState<Authority | null>(null);
    const [form, setForm] = useState({ name: '', description: '' });

    const fetchAuthorities = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/authorities/');
            setAuthorities(response.data);
        } catch (err) {
            setError('Failed to load authorities');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingAuthority) {
                await axios.put(`/api/authorities/${editingAuthority.id}/`, form);
            } else {
                await axios.post('/api/authorities/', form);
            }
            fetchAuthorities();
            setForm({ name: '', description: '' });
            setEditingAuthority(null);
        } catch (err) {
            setError('Failed to save authority');
        }
    };

    const handleEdit = (authority: Authority) => {
        setEditingAuthority(authority);
        setForm({ name: authority.name, description: authority.description });
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this authority?')) {
            try {
                await axios.delete(`/api/authorities/${id}/`);
                fetchAuthorities();
            } catch (err) {
                setError('Failed to delete authority');
            }
        }
    };

    useEffect(() => {
        fetchAuthorities();
    }, []);

    return (
        <div>
            <h1>Authority Management</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {authorities.map((auth) => (
                            <tr key={auth.id}>
                                <td>{auth.name}</td>
                                <td>{auth.description}</td>
                                <td>
                                    <button onClick={() => handleEdit(auth)}>Edit</button>
                                    <button onClick={() => handleDelete(auth.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <form onSubmit={handleSubmit}>
                <h2>{editingAuthority ? 'Edit Authority' : 'Add Authority'}</h2>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleInputChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleInputChange}
                />
                <button type="submit">{editingAuthority ? 'Update' : 'Create'}</button>
                {editingAuthority && (
                    <button type="button" onClick={() => setEditingAuthority(null)}>
                        Cancel
                    </button>
                )}
            </form>
        </div>
    );
};

export default AuthorityManagement;
