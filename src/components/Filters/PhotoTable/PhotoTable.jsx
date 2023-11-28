export const PhotoTable = ({
  visiblePhotos,
  columns,
  handleChangeSortingMethod,
  checkSortingMethod,
}) => (
  <div className="box table-container">
    {visiblePhotos.length === 0 ? (
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
              {columns.map(column => (
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    {column}
                    <a
                      href="#/"
                      onClick={() => handleChangeSortingMethod(
                        column.toLowerCase(),
                      )}
                    >
                      <span className="icon">
                        <i
                          data-cy="SortIcon"
                          className={`fas ${checkSortingMethod(column.toLowerCase())}`}
                        />
                      </span>
                    </a>
                  </span>
                </th>
              ))}
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

                <td className={`${photo.user.sex === 'm' ? 'has-text-link' : 'has-text-danger'}`}>
                  {photo.user.name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    )}
  </div>
);
