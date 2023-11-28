import './App.scss';
import React, { useState } from 'react';

import usersFromServer from './api/users';
import photosFromServer from './api/photos';
import albumsFromServer from './api/albums';
import { PhotoTable } from './components/Filters/PhotoTable/PhotoTable';
import { QueryFilter } from './components/Filters/QueryFilter/QueryFilter';
import { ResetFilters } from './components/Filters/ResetFilter/ResetFilters';

const photos = photosFromServer.map((photo) => {
  const album = albumsFromServer.find(a => a.id === photo.albumId);
  const user = usersFromServer.find(u => u.id === album.userId);

  return {
    ...photo,
    album: { ...album },
    user: { ...user },
  };
});

function filterAndSortPhotos(
  arrOfPhotos,
  searchQuery,
  selectedUserFilter,
  selectedAlbumFilter,
  sortBy,
  selectedSortingMethod,
) {
  const filteredPhotos = arrOfPhotos.filter((photo) => {
    const preparedQuery = searchQuery ? searchQuery.toLowerCase() : '';
    const preparedPhotoName = photo.title.toLowerCase();
    const preparedUserFilter = selectedUserFilter.toLowerCase();
    const preparedUserName = photo.user.name.toLowerCase();
    const preparedAlbumTitle = photo.album.title.toLowerCase();
    const preparedAlbumFilter = selectedAlbumFilter
      && selectedAlbumFilter !== 'All'
      ? selectedAlbumFilter.toLowerCase()
      : null;

    return (
      (searchQuery ? preparedPhotoName.includes(preparedQuery) : true)
      && (selectedUserFilter === 'All'
        ? true
        : preparedUserName === preparedUserFilter)
      && (!preparedAlbumFilter || preparedAlbumTitle === preparedAlbumFilter)
    );
  });

  if (sortBy && selectedSortingMethod) {
    return filteredPhotos.sort((a, b) => {
      let res = 0;

      switch (sortBy) {
        case 'id':
          res = a.id - b.id;
          break;

        case 'photo name':
          res = a.title.localeCompare(b.title);
          break;

        case 'album name':
          res = a.album.title.localeCompare(b.album.title);
          break;

        case 'user name':
          res = a.user.name.localeCompare(b.user.name);
          break;

        default:
          break;
      }

      if (selectedSortingMethod === 'desc') {
        res *= -1;
      }

      return res;
    });
  }

  return filteredPhotos;
}

export const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserFilter, setSelectedUserFilter] = useState('All');
  const [selectedAlbumFilter, setSelectedAlbumFilter] = useState('All');
  const [sortBy, setSortBy] = useState('');
  const [selectedSortingMethod, setSelectedSortingMethod] = useState('');

  const handleChangeSortingMethod = (field) => {
    if (sortBy !== field) {
      setSortBy(field);
      setSelectedSortingMethod('asc');

      return;
    }

    switch (selectedSortingMethod) {
      case '':
        setSelectedSortingMethod('asc');
        break;

      case 'asc':
        setSelectedSortingMethod('desc');
        break;

      case 'desc':
        setSelectedSortingMethod('');
        setSortBy('');
        break;

      default:
        break;
    }
  };

  const checkSortingMethod = (field) => {
    if (field !== sortBy) {
      return 'fa-sort';
    }

    if (selectedSortingMethod === 'asc') {
      return 'fa-sort-up';
    }

    return 'fa-sort-down';
  };

  const visiblePhotos = filterAndSortPhotos(
    photos,
    searchQuery,
    selectedUserFilter,
    selectedAlbumFilter,
    sortBy,
    selectedSortingMethod,
  );

  const columns = ['ID', 'Photo name', 'Album name', 'User name'];

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedUserFilter('All');
    setSelectedAlbumFilter('All');
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Photos from albums</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                href="#/"
                className={selectedUserFilter === 'All' ? 'is-active' : ''}
                onClick={() => setSelectedUserFilter('All')}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  href="#/"
                  className={selectedUserFilter === user.name
                    ? 'is-active' : ''}
                  onClick={() => setSelectedUserFilter(user.name)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <QueryFilter
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                className="button is-success mr-6 is-outlined"
                onClick={() => setSelectedAlbumFilter('All')}
              >
                All
              </a>

              {albumsFromServer.map(album => (
                <a
                  key={album.id}
                  className={`button mr-2 my-1${setSelectedAlbumFilter === 'button mr-2 my-1'
                    ? 'button mr-2 my-1 is-info' : ''}`}
                  href="#/"
                  onClick={() => setSelectedAlbumFilter(album.title)}
                >
                  {album.title}
                </a>
              ))}

            </div>

            <ResetFilters resetAllFilters={resetAllFilters} />
          </nav>
        </div>

        <PhotoTable
          visiblePhotos={visiblePhotos}
          columns={columns}
          handleChangeSortingMethod={handleChangeSortingMethod}
          checkSortingMethod={checkSortingMethod}
        />
      </div>
    </div>
  );
};
