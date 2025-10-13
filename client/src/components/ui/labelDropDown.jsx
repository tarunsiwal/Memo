import { useContext, useState, useEffect, useCallback } from 'react';
import { Plus, Tag, X } from 'lucide-react';
import '../../assets/css/labelDropDown.css';
import Spinner from '../helper/spinner.jsx';
import TruncatedText from '../helper/truncatedText.jsx';
import { TokenContext } from '../../App.jsx';

const apiUrl = import.meta.env.VITE_APP_API_URL;

function LabelsManager({ handleLabel, labels, setLabels }) {
  const [displayedLabels, setDisplayedLabels] = useState([]);
  const [allLabelsCache, setAllLabelsCache] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const token = useContext(TokenContext);

  // Function to save selected labels and close the dropdown
  const handleSaveAndClose = () => {
    // 1. Filter the entire cache (which holds the source of truth for all checks)
    const checkedLabelNames = allLabelsCache
      .filter((label) => label.checked)
      .map((label) => label.label);

    // 2. Set the parent state with the filtered list of names
    setLabels(checkedLabelNames);

    // 3. Close the dropdown
    handleLabel();
  };

  // Effect to filter displayed labels based on the search query and the allLabelsCache
  // This ensures the displayed list is always correct based on the cache's checked status.
  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();

    // Filter based on the source of truth (allLabelsCache)
    const filteredLabels = allLabelsCache.filter((label) =>
      label.label.toLowerCase().includes(query),
    );

    setDisplayedLabels(filteredLabels);
  }, [searchQuery, allLabelsCache]);

  const fetchLabels = useCallback(
    async (query) => {
      if (!token) return;
      setIsLoading(true);
      try {
        const response = await fetch(
          `${apiUrl}/user/labels/search?query=${query}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          },
        );
        if (!response.ok) {
          throw new Error(
            `Failed to fetch labels with status: ${response.status}`,
          );
        }
        const { labels: fetchedLabels } = await response.json();

        // Key logic: Initialize 'checked' status based on the parent's current 'labels' array
        const labelsWithStatus = fetchedLabels.map((label) => ({
          ...label,
          checked: labels.includes(label.label),
        }));

        if (query === '') {
          // Update the cache with the full list and correct checked status
          setAllLabelsCache(labelsWithStatus);
        } else {
          // For search results, we just display what the API returned,
          // the useEffect above handles merging with cache status.
          setDisplayedLabels(labelsWithStatus);
        }
      } catch (err) {
        console.error('Error fetching labels:', err);
      } finally {
        setIsLoading(false);
      }
    },
    // Dependency on 'labels' is crucial here to ensure initial checked status is correct
    [token, labels],
  );

  useEffect(() => {
    if (token) {
      fetchLabels(searchQuery);
    }
  }, [searchQuery, token, fetchLabels]);

  const handleAddLabel = async () => {
    const newLabelText = searchQuery.trim();
    if (!newLabelText) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/user/labels`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          label: newLabelText,
        }),
      });
      if (!response.ok && response.status !== 200) {
        console.error(`Add label failed with status: ${response.status}`);
        throw new Error('Failed to create label on server.');
      }

      // Select the new label in the parent state immediately (will re-trigger fetch)
      setLabels((prevLabels) => [...prevLabels, newLabelText]);

      setSearchQuery('');
      // Refetch the full list to include the newly created and now selected label
      await fetchLabels('');
    } catch (err) {
      console.log('Error adding label:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleLabel = (_id) => {
    // Only update the allLabelsCache (source of truth)
    setAllLabelsCache((prevCache) =>
      prevCache.map((label) =>
        label._id === _id ? { ...label, checked: !label.checked } : label,
      ),
    );
    // The displayedLabels will automatically update via the dedicated useEffect
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddLabel();
    }
  };

  const renderSpinner = () => (
    <div className="flex justify-center p-4">
      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div className="labels-container">
      {/* Header */}
      <div className="labels-header">
        <h2 className="labels-title">Labels</h2>
        <div className="labels-header-buttons">
          {/* Use handleSaveAndClose to commit changes before closing */}
          <button
            className="add-button"
            onClick={handleSaveAndClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Input field */}
      <div className="input-section">
        <input
          autoFocus
          type="text"
          placeholder="Type a label"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="label-input"
        />
      </div>

      {/* Labels list */}
      {isLoading ? (
        renderSpinner()
      ) : (
        <div className="labels-list">
          {displayedLabels.map((label) => (
            <div key={label._id} className="label-item">
              <Tag className="label-icon" />
              <span className="label-text">{label.label}</span>
              <input
                type="checkbox"
                checked={label.checked}
                onChange={() => handleToggleLabel(label._id)}
                className="label-checkbox"
              />
            </div>
          ))}
        </div>
      )}
      {displayedLabels.length === 0 && searchQuery && !isLoading && (
        <>
          <p className="message">
            No labels found for "
            <span className="font-semibold">{searchQuery}</span>". Click
            'Create' below.
          </p>
          <div>
            <button
              onClick={handleAddLabel}
              type="button"
              className="labels-createlabel-buttons"
            >
              <div>
                Create <TruncatedText text={searchQuery} wordLimit={8} />
              </div>
              <div className="add-button">
                <Plus className="h-4 w-4 " />
              </div>
            </button>
          </div>
        </>
      )}
      {allLabelsCache.length === 0 && !searchQuery && !isLoading && (
        <>
          <p className="message">You haven't created any labels yet.</p>
          <div>
            <button
              onClick={handleAddLabel}
              type="button"
              className="labels-createlabel-buttons"
            >
              <div>
                Create <TruncatedText text={searchQuery} wordLimit={8} />
              </div>
              <div className="add-button">
                <Plus className="h-4 w-4 " />
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default LabelsManager;
