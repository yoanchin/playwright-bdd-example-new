Feature: Playwright Home Page
  @MYT-2
  Scenario Outline: Check title
    Given I am on Playwright home page
    When I click link '<link>'
    Then I see in title '<title>'

    Examples:{'datafile':'testdata/testdata.xlsx','sheetName':'Sheet1'}
