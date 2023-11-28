import './App.scss';
import React, { useState } from 'react';

import usersFromServer from './api/users';
import photosFromServer from './api/photos';
import albumsFromServer from './api/albums';

const photos = photosFromServer.map((photo) => {
  const album = albumsFromServer.find(a => a.id === photo.albumId);
  const user = usersFromServer.find(u => u.id === album.userId);

  return {
    ...photo,
    album: { ...album },
    user: { ...user },
  };
});

function filterPhotos(arrOfPhotos,
  searchQuery,
  selectedUserFilter,
  selectedAlbumFilter) {
  if (!searchQuery && selectedUserFilter === 'All'
    && (!selectedAlbumFilter || selectedAlbumFilter === 'All')) {
    return arrOfPhotos;
  }

  return arrOfPhotos.filter((photo) => {
    const preparedQuery = searchQuery.toLowerCase();
    const preparedPhotoName = photo.title.toLowerCase();
    const preparedUserFilter = selectedUserFilter.toLowerCase();
    const preparedUserName = photo.user.name.toLowerCase();
    const preparedAlbumTitle = photo.album.title.toLowerCase();
    const preparedAlbumFilter = (selectedAlbumFilter
      && selectedAlbumFilter !== 'All')
      ? selectedAlbumFilter.toLowerCase()
      : null;

    return (
      (searchQuery ? preparedPhotoName.includes(preparedQuery) : true)
      && (selectedUserFilter === 'All'
        ? true : preparedUserName === preparedUserFilter)
      && (!preparedAlbumFilter
        || preparedAlbumTitle === preparedAlbumFilter)
    );
  });
}

export const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserFilter, setSelectedUserFilter] = useState('All');
  const [selectedAlbumFilter, setSelectedAlbumFilter] = useState('All');
  const visiblePhotos = filterPhotos(photos,
    searchQuery,
    selectedUserFilter,
    selectedAlbumFilter);

  const resetFilter = () => {
    setSearchQuery('');
  };

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

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                  }}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    type="button"
                    className="delete"
                    onClick={resetFilter}
                  />
                </span>
              </p>
            </div>

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

            <div className="panel-block">
              <a
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={resetAllFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {photos.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No photos matching selected criteria
            </p>
          ) : (
            <>
              <table
                className="table is-striped is-narrow is-fullwidth"
              >
                <thead>
                  <tr>
                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        ID

                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort" />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Photo name

                        <a href="#/">
                          <span className="icon">
                            <i className="fas fa-sort-down" />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Album name

                        <a href="#/">
                          <span className="icon">
                            <i className="fas fa-sort-up" />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        User name

                        <a href="#/">
                          <span className="icon">
                            <i className="fas fa-sort" />
                          </span>
                        </a>
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {visiblePhotos.map(photo => (
                    <tr key={photo.id}>
                      <td className="has-text-weight-bold">
                        {photo.id}
                      </td>

                      <td>{photo.title}</td>
                      <td>{photo.album.title}</td>

                      <td className="has-text-link">
                        {photo.user.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
