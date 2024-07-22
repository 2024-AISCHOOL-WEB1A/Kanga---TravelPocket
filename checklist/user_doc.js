$(document).ready(function() {
  $.ajax({
      url: '../data/countries_info.csv',
      dataType: 'text',
      success: function(data) {
          var allRows = data.split(/\r?\n|\r/);
          var table = '<table>';

          for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
              if (singleRow === 0) {
                  table += '<thead>';
                  table += '<tr>';
              } else {
                  table += '<tr>';
              }

              var rowCells = allRows[singleRow].split(',');
              for (var rowCell = 0; rowCell < rowCells.length; rowCell++) {
                  if (singleRow === 0) {
                      table += '<th>' + rowCells[rowCell] + '</th>';
                  } else {
                      table += '<td>' + rowCells[rowCell] + '</td>';
                  }
              }

              if (singleRow === 0) {
                  table += '</tr>';
                  table += '</thead>';
                  table += '<tbody>';
              } else {
                  table += '</tr>';
              }
          }
          table += '</tbody>';
          table += '</table>';

          $('div.content').append(table);
      }
  });
});