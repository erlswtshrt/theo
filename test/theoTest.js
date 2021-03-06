/*
Copyright (c) 2014, salesforce.com, inc. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var should = require('should');
var assert = require('assert');
var fs     = require('fs');
var path   = require('path');

var theo = require('./../lib/theo');

describe('theo', function(){

  beforeEach(function(done){
    if(fs.existsSync('./dist')){
      fs.readdirSync('./dist').forEach(function(fileName) {
        //fs.unlinkSync('./dist/' + fileName);
      });
    }
    if(!fs.existsSync('./dist')){
      fs.mkdirSync('./dist');
    }
    done();
  });

  after(function(){
    theo.batch(['Aura', 'Sass' , 'Stylus', 'Less', 'JSON', 'XML', 'HTML'], './test/mock', 'dist');

    assert(fs.existsSync('./dist/s1base.theme'), 'one.theme was not created.');
    assert(fs.existsSync('./dist/s1sub.theme'), 's1sub.theme was not created.');
    assert(fs.existsSync('./dist/s1base.scss'), 's1base.scss was not created.');
    assert(fs.existsSync('./dist/s1sub.scss'), 's1sub.scss was not created.');
    assert(fs.existsSync('./dist/s1base.styl'), 's1base.styl was not created.');
    assert(fs.existsSync('./dist/s1sub.styl'), 's1sub.scss was not created.');
    assert(fs.existsSync('./dist/s1base.less'), 's1base.less was not created.');
    assert(fs.existsSync('./dist/s1sub.less'), 's1sub.less was not created.');
    assert(fs.existsSync('./dist/s1base.json'), 's1base.json was not created.');
    assert(fs.existsSync('./dist/s1base.xml'), 's1base.xml was not created.');
  });

  describe('batch', function(){
    it('should convert an array of variables to theme tokens.', function(){
      theo.batch('Aura', './test/mock', 'dist');
      theo.batch('Sass', './test/mock', 'dist');
      theo.batch('Stylus', './test/mock', 'dist');
      theo.batch('Less', './test/mock', 'dist');
      theo.batch('JSON', './test/mock', 'dist');
      theo.batch('XML', './test/mock', 'dist');

      assert(fs.existsSync('./dist/s1base.theme'), 'one.theme was not created.');
      assert(fs.existsSync('./dist/s1sub.theme'), 's1sub.theme was not created.');
      assert(fs.existsSync('./dist/s1base.scss'), 's1base.scss was not created.');
      assert(fs.existsSync('./dist/s1sub.scss'), 's1sub.scss was not created.');
      assert(fs.existsSync('./dist/s1base.styl'), 's1base.styl was not created.');
      assert(fs.existsSync('./dist/s1sub.styl'), 's1sub.styl was not created.');
      assert(fs.existsSync('./dist/s1base.less'), 's1base.less was not created.');
      assert(fs.existsSync('./dist/s1sub.less'), 's1sub.less was not created.');
      assert(fs.existsSync('./dist/s1base.json'), 's1base.json was not created.');
      assert(fs.existsSync('./dist/s1base.xml'), 's1base.xml was not created.');
    });
  });

  describe('convert Sass', function(){

    it('should convert a variables object to Sass.', function(){
      var s1Base = JSON.parse(fs.readFileSync('./test/mock/s1base.json').toString());
      var aliasesJSON = JSON.parse(fs.readFileSync('./test/mock/aliases.json').toString());
      var result = theo.convert('Sass', s1Base, aliasesJSON.aliases);
      result.should.exist;
      result.should.containEql('$color-curious-blue: #2a94d6;');
    });

  });

  describe('convert Stylus', function(){

    it('should convert a variables object to Stylus.', function(){
      var s1Base = JSON.parse(fs.readFileSync('./test/mock/s1base.json').toString());
      var aliasesJSON = JSON.parse(fs.readFileSync('./test/mock/aliases.json').toString());
      var result = theo.convert('Stylus', s1Base, aliasesJSON.aliases);
      result.should.exist;
      result.should.containEql('color-curious-blue = #2a94d6');
    });

  });

  describe('convert Less', function(){

    it('should convert a variables object to Less.', function(){
      var s1Base = JSON.parse(fs.readFileSync('./test/mock/s1base.json').toString());
      var aliasesJSON = JSON.parse(fs.readFileSync('./test/mock/aliases.json').toString());
      var result = theo.convert('Less', s1Base, aliasesJSON.aliases);
      result.should.exist;
      result.should.containEql('@color-curious-blue: #2a94d6;');
    });

  });

  describe('convert Aura', function(){
    
    it('should convert a variables object to a theme token.', function(){
      var json = JSON.parse(fs.readFileSync('./test/mock/s1base.json').toString());
      var aliasesJSON = JSON.parse(fs.readFileSync('./test/mock/aliases.json').toString());
      var result = theo.convert('Aura', json, aliasesJSON.aliases);
      result.should.exist;
      result.should.containEql('<aura:theme >');
      result.should.containEql('<aura:var name="colorCuriousBlue" value="#2a94d6" />');
    });

    it('should preserve single quotes.', function(){
      var json = JSON.parse(fs.readFileSync('./test/mock/s1base.json').toString());
      var aliasesJSON = JSON.parse(fs.readFileSync('./test/mock/aliases.json').toString());
      var result = theo.convert('Aura', json, aliasesJSON.aliases);
      result.should.exist;
      result.should.containEql('<aura:var name="fontBold" value="\'ProximaNovaSoft-Bold\'" />');
    });

    it('should add extends if JSON is extending a base.', function(){
      var json = JSON.parse(fs.readFileSync('./test/mock/s1sub.json').toString());
      var aliasesJSON = JSON.parse(fs.readFileSync('./test/mock/aliases.json').toString());
      var result = theo.convert('Aura', json, aliasesJSON.aliases);
      result.should.containEql('<aura:theme extends="one:theme">');
    });

    it('should add imports if JSON has a list of imports.', function(){
      var json = JSON.parse(fs.readFileSync('./test/mock/s1sub.json').toString());
      var aliasesJSON = JSON.parse(fs.readFileSync('./test/mock/aliases.json').toString());
      var result = theo.convert('Aura', json, aliasesJSON.aliases);
      result.should.containEql('<aura:importTheme name="one:mqCommons"/>');
    });

    it('should resolve aliases.', function(){
      var json = JSON.parse(fs.readFileSync('./test/mock/s1base.json').toString());
      var aliasesJSON = JSON.parse(fs.readFileSync('./test/mock/aliases.json').toString());
      var result = theo.convert('Aura', json, aliasesJSON.aliases);
      result.should.containEql('<aura:var name="colorWhite" value="#ffffff" />');
    });

  });

  describe('convert JSON', function(){
    
    it('should convert a variables object to JSON.', function(){
      var json = JSON.parse(fs.readFileSync('./test/mock/s1base.json').toString());
      var aliasesJSON = JSON.parse(fs.readFileSync('./test/mock/aliases.json').toString());
      var result = theo.convert('JSON', json, aliasesJSON.aliases);
      result.should.exist;
      result.should.containEql('colorWhite');

      var json = JSON.parse(result);
      json.variables.should.be.instanceof(Array);
      json.variables.length.should.be.greaterThan(1);
    });

    it('should resolve aliases inside a value', function(){
      var json = JSON.parse(fs.readFileSync('./test/mock/s1base.json').toString());
      var aliasesJSON = JSON.parse(fs.readFileSync('./test/mock/aliases.json').toString());
      var result = theo.convert('JSON', json, aliasesJSON.aliases);
      result.should.exist;
      result.should.containEql('0 1px 3px rgba(0,0,0,.2)');
    });

  });

  describe('convert XML', function(){
    
    it('should convert a variables object to XML.', function(){
      var json = JSON.parse(fs.readFileSync('./test/mock/s1base.json').toString());
      var aliasesJSON = JSON.parse(fs.readFileSync('./test/mock/aliases.json').toString());
      var result = theo.convert('XML', json, aliasesJSON.aliases);
      result.should.exist;
      result.should.containEql('<variable name="COLOR_CURIOUS_BLUE" value="#2a94d6" />');
    });

  });

  describe('create docs', function(){
    
    it('should convert a variables object to a HTML documentation.', function(){
      var json = JSON.parse(fs.readFileSync('./test/mock/s1base.json').toString());
      var aliasesJSON = JSON.parse(fs.readFileSync('./test/mock/aliases.json').toString());
      var result = theo.convert('HTML', json, aliasesJSON.aliases);
      result.should.exist;
      result.should.containEql('<html>');
      result.should.containEql('line-height: 1.5');
    });

    it('should add line-height units to HTML documentation if not present.', function(){
      var json = JSON.parse(fs.readFileSync('./test/mock/s1base.json').toString());
      var aliasesJSON = JSON.parse(fs.readFileSync('./test/mock/aliases.json').toString());
      var result = theo.convert('HTML', json, aliasesJSON.aliases);
      result.should.containEql('background-size: 100% 1.5em');
    });


  });

  describe('generate spacings', function(){
    
    it('should create a css file with the proper spacings.', function(){

      theo.generateSpacings('./test/mock/s1base.json', './generated/spacings.css');
      var result = fs.readFileSync('./generated/spacings.css').toString();
      result.should.exist;
      result.should.containEql('.pax { padding: 28px;  }');
      result.should.containEql('.pvl { padding-top: 18px;  padding-bottom: 18px; }')
      result.should.containEql('.mhn { margin-left: 0px;  margin-right: 0px; }');
    });

  });


});