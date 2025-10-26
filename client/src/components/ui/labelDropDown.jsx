import {
  useContext,
  useState,
  useEffect,
  useCallback,
  forwardRef,
} from 'react';
import { Plus, Tag, X } from 'lucide-react';
import '../../assets/css/labelDropDown.css';
import Spinner from '../helper/spinner.jsx';
import TruncatedText from '../helper/truncatedText.jsx';
import { TokenContext, ApiUrlContext } from '../../App.jsx';

const LabelsManager = forwardRef(({ handleLabel, labels, setLabels }, ref) => {
  const [displayedLabels, setDisplayedLabels] = useState([]);
  const [allLabelsCache, setAllLabelsCache] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const apiUrl = useContext(ApiUrlContext);
  const token = useContext(TokenContext);

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    const filteredLabels = allLabelsCache.filter((label) =>
      label.label.toLowerCase().includes(query),
    );

    setDisplayedLabels(filteredLabels);
  }, [searchQuery, allLabelsCache]);

  const handleSaveAndClose = () => {
    handleLabel();
  };

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
        const labelsWithStatus = fetchedLabels.map((label) => ({
          ...label,
          checked: labels.includes(label.label),
        }));

        if (query === '') {
          setAllLabelsCache(labelsWithStatus);
        } else {
          setDisplayedLabels(labelsWithStatus);
        }
      } catch (err) {
        console.error('Error fetching labels:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [token, labels],
  );

  useEffect(() => {
    if (token) {
      const timer = setTimeout(() => {
        fetchLabels(searchQuery);
      }, 0);
      return () => clearTimeout(timer);
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

      setLabels((prevLabels) => [...prevLabels, newLabelText]);

      setSearchQuery('');
      await fetchLabels('');
    } catch (err) {
      console.log('Error adding label:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleLabel = (_id) => {
    setAllLabelsCache((prevCache) => {
      const updatedCache = prevCache.map((label) =>
        label._id === _id ? { ...label, checked: !label.checked } : label,
      );
      const checkedLabelNames = updatedCache
        .filter((label) => label.checked)
        .map((label) => label.label);
      setLabels(checkedLabelNames);
      return updatedCache;
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddLabel();
    }
  };

  return (
    <div className="labels-container" ref={ref}>
      {/* Header */}
      <div className="labels-header">
        <h2 className="labels-title">Labels</h2>
        <div className="labels-header-buttons">
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
          placeholder="Create label.."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="label-input"
        />
      </div>

      {/* Labels list */}
      {isLoading ? (
        <div style={{ padding: '5px 0' }}>
          <Spinner width={'15px'} />
        </div>
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
});

export default LabelsManager;
