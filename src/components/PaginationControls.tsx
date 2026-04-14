import styles from "../styles.module.scss";

interface PaginationControlsProps {
  currentPageNumber: number;
  totalPages: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
}

const PaginationControls = ({
  currentPageNumber,
  totalPages,
  isFirstPage,
  isLastPage,
  goToPreviousPage,
  goToNextPage
}: PaginationControlsProps) => {
  return (
    <div className={styles.paginationControls}>
      <button
        className={styles.paginationButton}
        onClick={goToPreviousPage}
        disabled={isFirstPage}
      >
        Previous
      </button>

      <span className={styles.pageIndicator}>
        Page {currentPageNumber + 1} of {totalPages}
      </span>

      <button
        className={styles.paginationButton}
        onClick={goToNextPage}
        disabled={isLastPage}
      >
        Next
      </button>
    </div>
  );
};

export default PaginationControls;