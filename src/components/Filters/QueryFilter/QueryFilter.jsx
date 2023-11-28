export const QueryFilter = ({ searchQuery, setSearchQuery }) => (
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
          onClick={() => setSearchQuery('')}
        />
      </span>
    </p>
  </div>
);
