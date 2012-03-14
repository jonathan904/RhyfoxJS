casper = require('casper').create logLevel: "debug"

casper.start 'http://www.google.fr/', ->
    @test.assertTitle 'Google', 'google homepage title is the one expected'
    @test.assertExists 'form[name=f]', 'main form is found'
    @fill 'form[name=f]', q: 'foo', true

casper.then ->
    @test.assertTitle 'foo - Recherche Google', 'google title is ok'
    @test.assertUrlMatch /q=foo/, 'search term has been submitted'
    test = -> __utils__.findAll('h3.r').length >= 10
    @test.assertEval test, 'google search for "foo" retrieves 10 or more results'

casper.run -> @test.renderResults true
