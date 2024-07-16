import React, { useState } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import styles from './Table.module.scss';

const Table = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data,
    },
    useSortBy,
    usePagination
  );



  return (
    <>
      <div className={styles.setSizeTable}>
        <table {...getTableProps()} className='table' style={{ marginLeft: '7px' }}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}
                    style={{ fontSize: '13px', width: column.width }}
                  >
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    const cellValue = cell.render('Cell');
                    return (
                    <td
                      {...cell.getCellProps()}
                      style={{
                        fontSize: '13px',
                        textAlign: cell.column.align ? cell.column.align : 'left',
                      }}
                    >
                      {cellValue}
                    </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>{'<<'}</button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>{'<'}</button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>{'>'}</button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>{'>>'}</button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>

        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value));
          }}
          className={styles.customSelect}
        >
          {[10, 25].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default Table;