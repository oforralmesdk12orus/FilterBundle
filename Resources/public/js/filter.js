
$(document).ready(function ()
{
    'use strict';
    console.log('use strict');

    var solventField = $('#mesd_filterbundle_filter_filterRow');
    if (solventField !== undefined) {
        var solvent = solventField.val();
        if ('' !== solvent) {
            var dropdown = $('#mesd_filterbundle_filter_filterEntity');
            changeModalsBasedOnDropdown(dropdown);
        }

        // when category is changed
        $('#mesd_filterbundle_filter_filterEntity').on('change', function () {
            console.log('category is changed');
            var dropdown = this;

            changeInterfaceBasedOnDropdown(dropdown);

        });
    }
});

function changeInterfaceBasedOnDropdown (dropdown)
{
    console.log('change interface based on dropdown');
    
    var url = $(dropdown).attr('data-url');
    url = url.replace('-1', $(dropdown).val());
    $.ajax({
        url: url
    }).done(function (data) {
        initializeSingleRow(data.associations);
        checkIfAddButtonIsNeeded(data.associations);
        initializeModals(data.associations);
    });
}

function changeModalsBasedOnDropdown (dropdown)
{
    console.log('change modals based on dropdown');

    if ('' !== $(dropdown).val()) {
        var url = $(dropdown).attr('data-url');
        url = url.replace('-1', $(dropdown).val());
        $.ajax({
            url: url
        }).done(function (data) {
            checkIfAddButtonIsNeeded(data.associations);
            initializeModals(data.associations);
        });
    }
}

function checkIfAddButtonIsNeeded (associations)
{
    console.log('check if add button is needed');
    
    var column = $('#filter-interface-table').attr('data-columns');
    if (1 < parseInt(column)) {
        var html = '';
        html += '<a id="filter-row-add" class="btn btn-default" href="#">';
        html += 'Add Row';
        html += '</a>';
        $('#filter-interface').append(
            html
        );

        $('#filter-row-add').on('click', function (event) {
            event.preventDefault();
            var html = '';
            html += '<tr class="or">';
            html += '<td colspan="' + ((associations.length * 2) - 1) + '">OR</td>';
            html += '</tr>';
            html += addSingleRow(associations);
            var table = $('#filter-interface-table');
            table.append(
                html
            );
            addDeleteListeners();
        });
    }
}

function initializeSingleRow (associations)
{
    console.log('initialize a single row');

    var html = '<table';
    html += ' id="filter-interface-table"';
    html += ' class="table table-striped table-bordered table-hover table-responsive"';
    html += ' data-rows="1"';
    var n = 0;
    for (var key in associations) {
        n++;
    }
    html += ' data-columns="' + n + '"';
    html += '>';
    html += '<tbody>';
    html += '<tr>';
    var i = 0;
    for (var key in associations) {
        if (0 < i) {
            html += '<th></th>';
        }
        html += '<th>' + associations[key].name + '</th>';
        i++;
    }
    if (1 < n) {
        html += '<th>Delete Row</th>'
    }
    html += '</tr>';
    html += addSingleRow(associations);
    html += '</tbody>';
    html += '</table>';
    $('#filter-interface').html(
        html
    );
}

function initializeModals (associations)
{
    console.log('initialize modals');

    var html = '';
    for (var key in associations) {
        html += '<div';
        html += ' class="modal fade"';
        html += ' id="' + associations[key].code + 'Modal"';
        html += ' tabindex="-1"';
        html += ' role="dialog"';
        html += ' aria-labelledby="' + associations[key].code + 'ModalLabel"';
        html += '>';
        html += '<div';
        html += ' class="modal-dialog"';
        html += ' role="document"';
        html += '>';
        html += '<div';
        html += ' class="modal-content"';
        html += '>';
        html += '<div';
        html += ' class="modal-header"';
        html += '>';
        html += '<button type="button"';
        html += ' class="close"';
        html += ' data-dismiss="modal"';
        html += ' aria-label="Close"><span';
        html += ' aria-hidden="true"';
        html += '>';
        html += '&times;</span></button>';
        html += '<h4';
        html += ' class="modal-title"';
        html += ' id="' + associations[key].code + 'ModalLabel">Edit ' + associations[key].name + '</h4>';
        html += '</div>';
        html += '<div';
        html += ' class="modal-body"';
        html += '>';
        html += '<form';
        html += ' id="' + associations[key].code + 'Form"';
        html += '>';
        html += '<div';
        html += ' class="form-group"';
        html += '>';
        html += '<label';
        html += ' for="cell-join"';
        html += ' class="control-label">' + associations[key].name + ':</label>';
        html += '<select';
        html += ' class="form-control change-cell-dropdown"';
        html += ' id="' + associations[key].code + '-cell-join"';
        html += ' name="cell-join"';
        html += ' data-association-id="' + associations[key].associationId + '"';
        html += '>';
        html += '<option></option>';
        for (var i = 0; i < associations[key].cells.length; i++) {
            html += '<option value="' + JSON.stringify(associations[key].cells[i].solvent) + '">';
            html += associations[key].cells[i].description;
            html += '</option>';
        }
        html += '<option';
        html += ' value="-1">Other</option>';
        html += '</select>';
        html += '</div>';
        html += '<div';
        html += ' class="form-group hidden">';
        html += '<input';
        html += ' type="hidden"';
        html += ' id="' + associations[key].code + '-new-cell"';
        html += ' name="new-cell[]"';
        html += ' class="new-cell form-control"';
        html += ' data-entity-data-url="' + associations[key].entityDataUrl + '"'
        html += ' />';
        html += '</div>';
        html += '<input type="hidden"';
        html += ' name="trail-entity-id"';
        html += ' value="' + associations[key].trailEntityId + '" />';
        html += '<input type="hidden"';
        html += ' name="association-id"';
        html += ' value="' + associations[key].associationId + '" />';
        html += '</form>';
        html += '</div>';
        html += '<div';
        html += ' class="modal-footer"';
        html += '>';
        html += '<button type="button"';
        html += ' class="btn btn-default"';
        html += ' data-dismiss="modal">Close</button>';
        html += '<button type="button"';
        html += ' class="btn btn-primary modal-save"';
        html += ' data-code="' + associations[key].code + '"';
        html += ' >Set ' + associations[key].name + '</button>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
    }
    $('#modals').html(
        html
    );
    
    addModalListeners();
    addDeleteListeners();
}

function addSingleRow(association)
{
    console.log('add single row');

    var html = '';
    html += '<tr';
    html += ' class="filter-row">';
    var i = 0;
    var row = $('#filter-interface-table').attr('data-rows');
    if (undefined === row) {
        row = 0;
    }
    for (var key in association) {
        if (0 < i) {
            html += '<td>AND</td>';
        }
        html += '<td>';
        html += '<div';
        html += ' id="' + association[key].code + '-' + row + '"';
        html += ' class="filter-cell"';
        html += ' data-cell-solvent="[-1]"';
        html += ' data-association-id="' + association[key].associationId + '">';
        html += 'No ' + association[key].name + ' selected';
        html += '</div>';
        html += '<div>';
        html += '<button';
        html += ' type="button"';
        html += ' class="btn btn-default"';
        html += ' data-toggle="modal"';
        html += ' data-target="#' + association[key].code + 'Modal"';
        html += ' data-div-id="' + association[key].code + '-' + row + '" >';
        html += 'Edit ' + association[key].name;
        html += '</button>';
        html += '</div>';
        html += '</td>';
        i++;
    }
    var n = 0;
    for (var key in association) {
        n++;
    }
    if (1 < n) {
        html += '<td><button id="delete-row-' + row + '"';
        html += ' "type="button"';
        html += ' class="btn btn-default delete-row no-listener"';
        html += ' >Delete Row</button></td>';
    }
    $('#filter-interface-table').attr('data-rows', parseInt(row) + 1);
    html += '</tr>';

    return html;
}

function updateSolvent()
{
    console.log ('update solvent');

    var rows = $('.filter-row');
    var n = rows.length;
    var rowSolvent = [];
    for (var i = 0; i < n; i++) {
        var cells = $(rows[i]).find('.filter-cell');
        var n2 = cells.length;
        var cellSolvent = [];
        for (var i2 = 0; i2 < n2; i2++) {
            var cell = $(cells[i2]);
            var solvent = JSON.parse(cell.attr('data-cell-solvent'));
            var associationId = cell.attr('data-association-id');
            var json = {
                associationId: associationId,
                solvent: solvent
            };
            cellSolvent.push(json);
        }
        rowSolvent.push(cellSolvent);
    }
    var value = JSON.stringify(rowSolvent);
    $('#mesd_filterbundle_filter_filterRow').val(value);
}

function formatResult(item) {

   return item.text;
}

function formatSelection(item) {

   return item.text;
}

function addModalListeners()
{
    console.log('add modal listeners');
    
    $('.new-cell').each(function() {
        newCell = $(this);
        newCell.select2({
            placeholder: "Search",
            // minimumInputLength: 1,
            multiple: true,
            ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
                url: newCell.attr('data-entity-data-url'),
                dataType: 'json',
                quietMillis: 250,
                data: function (term, page) {
                    return {
                        searchTerm: term, // search term
                        page: page // page number
                    };
                },
                results: function (data, page) {
                    var more = (page * 30) < data.total_count; // whether or not there are more results available

                    // notice we return the value of more so Select2 knows if more results can be loaded
                    return { results: data.items, more: more };
                },
                cache: true
            },
            // initSelection: function(element, callback) {
            //     // the input tag has a value attribute preloaded that points to a preselected repository's id
            //     // this function resolves that id attribute to an object that select2 can render
            //     // using its formatResult renderer - that way the repository name is shown preselected
            //     var id = $(element).val();
            //     if (id !== "") {
            //         $.ajax("https://api.github.com/repositories/" + id, {
            //             dataType: "json"
            //         }).done(function(data) { callback(data); });
            //     }
            // },
            formatResult: formatResult, // omitted for brevity, see the source of this page
            formatSelection: formatSelection,  // omitted for brevity, see the source of this page
            dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
            escapeMarkup: function (m) { return m; }, // we do not want to escape markup since we are displaying html in results
            'width':'resolve'
        });
    });

    $('.change-cell-dropdown').on('change', function () {
        console.log('cell dropdown changed');
        
        var dropdown = $(
            '#' + $(this).attr('id').replace('-cell-join', '-new-cell')
        );
        if ('Other' === $(this).children(':selected').text()) {
            console.log('other is selected');

            dropdown.parent().removeClass('hidden');
        } else {
            console.log('other is not selected');

            dropdown.parent().addClass('hidden');
        }
    });

    $('.modal').on('show.bs.modal', function (event) {
        console.log('on modal show');

        var button = $(event.relatedTarget);
        var divId = button.attr('data-div-id');
        var modal = $(this);
        modal.find('.new-cell option').removeAttr('selected');
        modal.find('.modal-save').attr('data-div-id', divId);
    });

    $('.modal-save').on('click', function (event) {
        event.preventDefault();
        console.log('on modal save');

        var button = $(this);
        var modal = $('#' + button.attr('data-code') + 'Modal');
        var form = $('#' + button.attr('data-code') + 'Form');
        var div = $('#' + button.attr('data-div-id'));
        var associationId = div.attr('data-association-id');
        var data = form.serializeArray();
        var cellJoin = $('#' + button.attr('data-code') + '-cell-join');
        var description = '';
        var selectedValues = '';
        var selectedValuesString = '';
        var selectedText = cellJoin.children(':selected').text();
        if ('Other' === selectedText) {
            console.log('other was selected');
            
            var newCell = $('#' + button.attr('data-code') + '-new-cell');
            selectedValues = newCell.val().split(',');
            n = selectedValues.length;
            for (var i = 0; i < n; i++) {
                selectedValues[i] = parseInt(selectedValues[i]);
            }
            selectedValues.sort(function (a, b)
            {
                return a - b;
            });
            selectedValuesString = JSON.stringify(selectedValues);
            var selectedOptions = newCell.parent().find('.select2-search-choice div');
            description = '';
            i = 0;
            var n = selectedOptions.length;
            selectedOptions.each(function() {
                if (0 < i) {
                    description += ', ';
                    if ((i + 1) === n) {
                        description += 'or ';
                    }
                }
                description += $(this).html();
                i++;
            });
        } else {
            console.log('other was not selected');

            description = selectedText;
            selectedValuesString = cellJoin.val();
        }
        div.html(description);
        div.attr('data-cell-solvent', selectedValuesString);
        updateSolvent();
        modal.modal('hide');
    });
}

function addDeleteListeners()
{
    console.log('add delete listeners');

    $('.delete-row.no-listener').on('click', function(event) {
        event.preventDefault();
        console.log('on delete row');
        
        var previousSibling = $(this).parent().parent().prev();
        if (previousSibling.hasClass('or')) {
            previousSibling.remove();
        }
        $(this).parent().parent().remove();
    });
    $(this).removeClass('no-listener');
}
