export const ResetFilters = ({ resetAllFilters }) => (
  <div className="panel-block">
    <a
      data-cy="ResetAllButton"
      href="#/"
      className="button is-link is-outlined is-fullwidth"
      onClick={resetAllFilters}
    >
      Reset all filters
    </a>
  </div>
);
