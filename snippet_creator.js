//=============================================================================
//  Snippet Creator plugin
//  http://musescore.org/en/project/snippetcreator
//
//  Copyright (C)2010 Nicolas Froment (lasconic)
//
//  This program is free software; you can redistribute it and/or modify
//  it under the terms of the GNU General Public License version 2.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with this program; if not, write to the Free Software
//  Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.
//=============================================================================

//---------------------------------------------------------
//    init
//---------------------------------------------------------

function init()
      {
      };


//---------------------------------------------------------
//    run
//---------------------------------------------------------

function run()
      {
      if (typeof curScore === 'undefined')
          return;
      if (curScore.pages > 1) {
          QMessageBox.warning(0, qsTr("Warning"), qsTr("Snippet Creator works on single page score only."));
          return;
      }
      //Open save as
      var path = QFileDialog.getSaveFileName(0, qsTr("Save Snippet"),
                            QDir.homePath(),
                            qsTr("Images (*.png)"));
       
      //Save as PNG
      curScore.save(path, "png", false, false, 100, false);
            
      //Find bounders
      var fi = new QFileInfo(path);
      var base = fi.baseName();
      var dir = fi.path();
      
      var page1 = dir+"/"+ base +"-1.png";

      var image = new QImage(page1);
      var x1 = image.width();
      var x2 = 0;
      var y1 = image.height();
      var y2 = 0;
      var transparent = 0;
      var margin = 5;
      var nontransparent = parseInt('FFFFFFFF',16);
      for(var x=0; x < image.width(); x++) {
            for(var y=0; y < image.height(); y++) {
                  var c = image.pixel(x,y);
                  if (c != nontransparent ) {
                    if (x < x1)
                      x1 = x;
                    if(x > x2)
                      x2 = x;  
                    if (y < y1)
                      y1 = y;
                    if(y > y2)
                      y2 = y;
                  }
            }
      }
      // Crop
      if(x1 < x2 && y1 < y2 && (x1-margin)> 0 && (x2+margin)<image.width() && (y1 - margin) > 0 && (y2+margin)<image.height()) {
            var rect = new QRect(x1- margin, y1 - margin, x2-x1 + 2*margin, y2-y1 + 2 * margin);
            var result = image.copy(rect);
            var outFile = new QFile(path);
            if (!outFile.open(QIODevice.WriteOnly))
                 return;
            
            result.save(outFile, "PNG");
            outFile.close();
      }
      //delete page-1
      var file = new QFile(page1);
      file.remove();
      };


var mscorePlugin = {
      menu: 'Plugins.Snippet Creator',
      init: init,
      run:  run
      };

mscorePlugin;

