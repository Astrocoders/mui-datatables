import React from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import MuiTableHead from '@material-ui/core/TableHead';

import Container from './dnd/Container';
import Draggable from './dnd/Draggable';

import TableHeadRow from './TableHeadRow';
import TableHeadCell from './TableHeadCell';
import TableSelectCell from './TableSelectCell';
import { withStyles } from '@material-ui/core/styles';

const defaultHeadStyles = theme => ({
  main: {},
  responsiveStacked: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
});

class TableHead extends React.Component {
  componentDidMount() {
    this.props.handleHeadUpdateRef(this.handleUpdateCheck);
  }

  handleToggleColumn = index => {
    this.props.toggleSort(index);
  };

  handleRowSelect = () => {
    this.props.selectRowUpdate('head', null);
  };

  onDragStart = ({payload}) => {
    const {handleLaneDragStart} = this.props;
    handleLaneDragStart(payload.id);
  };

  onLaneDrop = ({removedIndex, addedIndex, payload}) => {
    const {actions, handleLaneDragEnd} = this.props;
    if (removedIndex !== addedIndex) {
      actions.moveLane({oldIndex: removedIndex, newIndex: addedIndex});
      handleLaneDragEnd(removedIndex, addedIndex, payload);
    };
  };

  render() {
    const { classes, columns, count, options, data, page, setCellRef, selectedRows } = this.props;

    const numSelected = (selectedRows && selectedRows.data.length) || 0;
    const isDeterminate = numSelected > 0 && numSelected < count;
    const isChecked = numSelected === count ? true : false;

    return (
      <MuiTableHead
        className={classNames({ [classes.responsiveStacked]: options.responsive === 'stacked', [classes.main]: true })}>
        <TableHeadRow>
          {options.selectableRows && (
            <TableSelectCell
              ref={el => setCellRef(0, findDOMNode(el))}
              onChange={this.handleRowSelect.bind(null)}
              indeterminate={isDeterminate}
              checked={isChecked}
              isHeaderCell={true}
              isExpandable={options.expandableRows}
              fixedHeader={options.fixedHeader}
            />
          )}
          {columns.map(
            (column, index) =>
              column.display === 'true' &&
              (column.customHeadRender ? (
                column.customHeadRender({ index, ...column }, this.handleToggleColumn)
              ) : (
                <TableHeadCell
                  key={index}
                  index={index}
                  type={'cell'}
                  ref={el => setCellRef(index + 1, findDOMNode(el))}
                  sort={column.sort}
                  sortDirection={column.sortDirection}
                  toggleSort={this.handleToggleColumn}
                  hint={column.hint}
                  options={options}>
                    <Container
                      orientation="horizontal"
                      onDragStart={this.onDragStart}
                      dragClass=""
                      dropClass=""
                      onDrop={this.onLaneDrop}
                      lockAxis="x"
                      getChildPayload={index => this.columns(index)}
                      groupName="1">
                      <Draggable key={index}>
                        {column.name}
                      </Draggable>
                  </Container>
                </TableHeadCell>
              )),
          )}
        </TableHeadRow>
      </MuiTableHead>
    );
  }
}

export default withStyles(defaultHeadStyles, { name: 'MUIDataTableHead' })(TableHead);
