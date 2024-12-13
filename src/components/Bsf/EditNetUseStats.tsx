import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store'; // Ensure RootState and AppDispatch are defined in the store
import { updateNetUseStats } from '../../features/bsf/EditNetUseStatsSlice'; // Import the async thunkx';
import { fetchNetUseStats } from '../../features/bsf/netUseStatsSlice';

interface MediaItem {
  title: string;
  file: File | null;
  comments?: string;
}

const EditNetUseStats: React.FC<{ id: number; companyId: number; farmId: number; batchId: number }> = ({
  id,
  companyId,
  farmId,
  batchId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, netUseStats } = useSelector((state: RootState) => state.netUseStats);

  const [formData, setFormData] = useState({
    company: '',
    farm: '',
    batch: '',
    harvest_weight: '',
    lay_end: '',
    stats: '',
    media: [] as MediaItem[],
  });

  // Fetch existing data when component mounts
  useEffect(() => {
    dispatch(fetchNetUseStats({ companyId, farmId, batchId, id }));
  }, [dispatch, companyId, farmId, batchId, id]);

  // Populate the form when `netUseStats` changes
  useEffect(() => {
    if (netUseStats && netUseStats.length > 0) {
      const data = netUseStats[0]; // Assuming the API returns an array
      setFormData({
        company: data.company ? data.company.toString() : '', // Default to an empty string if null
        farm: data.farm ? data.farm.toString() : '',
        batch: data.batch ? data.batch.toString() : '',
        harvest_weight: data.harvest_weight ? data.harvest_weight.toString() : '',
        lay_end: data.lay_end || '', // Default to an empty string
        stats: data.stats || '', // Default to an empty string
        media: Object.keys(data)
          .filter((key) => key.startsWith('media_title_'))
          .map((key, index) => ({
            title: data[`media_title_${index}`] || '', // Default to an empty string
            file: null, // Files cannot be populated directly, user must re-upload
            comments: data[`media_comments_${index}`] || '', // Default to an empty string
          })),
      });
    }
  }, [netUseStats]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMediaChange = (
    index: number,
    field: keyof MediaItem,
    value: string | File | null
  ) => {
    if (field === 'file' && value === null) return;
    setFormData((prev) => {
      const updatedMedia = [...prev.media];
      updatedMedia[index] = { ...updatedMedia[index], [field]: value as string | File };
      return { ...prev, media: updatedMedia };
    });
  };

  const addMedia = () => {
    setFormData((prev) => ({
      ...prev,
      media: [...prev.media, { title: '', file: null, comments: '' }],
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const transformedData = {
      ...formData,
      company: Number(formData.company),
      farm: Number(formData.farm),
      batch: Number(formData.batch),
      harvest_weight: Number(formData.harvest_weight),
    };

    dispatch(updateNetUseStats({ id, data: transformedData }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Company</label>
        <input
          name="company"
          value={formData.company}
          onChange={handleInputChange}
          type="number"
          disabled
        />
      </div>
      <div>
        <label>Farm</label>
        <input name="farm" value={formData.farm} onChange={handleInputChange} type="number" disabled />
      </div>
      <div>
        <label>Batch</label>
        <input name="batch" value={formData.batch} onChange={handleInputChange} type="number" disabled />
      </div>
      <div>
        <label>Harvest Weight</label>
        <input
          name="harvest_weight"
          value={formData.harvest_weight}
          onChange={handleInputChange}
          type="number"
        />
      </div>
      <div>
        <label>Lay End</label>
        <input name="lay_end" value={formData.lay_end} onChange={handleInputChange} type="date" />
      </div>
      <div>
        <label>Stats</label>
        <input name="stats" value={formData.stats} onChange={handleInputChange} type="text" />
      </div>
      {formData.media.map((media, index) => (
        <div key={index}>
          <label>Media Title</label>
          <input
            value={media.title}
            onChange={(e) => handleMediaChange(index, 'title', e.target.value)}
          />
          <label>Media File</label>
          <input
            type="file"
            onChange={(e) =>
              handleMediaChange(index, 'file', e.target.files ? e.target.files[0] : null)
            }
          />
          <label>Media Comments</label>
          <input
            value={media.comments || ''}
            onChange={(e) => handleMediaChange(index, 'comments', e.target.value)}
          />
        </div>
      ))}
      <button type="button" onClick={addMedia}>
        Add Media
      </button>
      <button type="submit" disabled={loading}>
        {loading ? 'Updating...' : 'Update'}
      </button>
      {error && <p>Error: {error}</p>}
    </form>
  );
};

export default EditNetUseStats;
