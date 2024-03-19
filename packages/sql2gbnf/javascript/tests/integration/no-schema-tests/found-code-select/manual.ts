/**
 * Manually discovered SQL queries on the internet.
 * 
 * Each snippet should have a URL pointing to its source
 */

const tests = [
  // https://mode.com/sql-tutorial/sql-inner-join
  `SELECT teams.conference AS conference,\\nAVG(players.weight) AS average_weight\\nFROM benn.college_football_players players\\nJOIN benn.college_football_teams teams\\nON teams.school_name = players.school_name\\nGROUP BY teams.conference\\nORDER BY AVG(players.weight) DESC`,
];
export default tests;
