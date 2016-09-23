// Code goes here
(function () {
  'use strict';
  //  MainCtrl.$inject = [ 'github'];
  angular.module('lol', [])
    .service('GithubPersonasService', GithubPersonasService)
    .controller('PersonaSearchController', PersonaSearchController)
    .controller('PersonasShowController', PersonasShowController)
    .controller('PersonaAddController', PersonaAddController)
    .factory('githubFactory', githubFactory);
  //    .factory('githubRepoFactory', githubRepoFactory);

  PersonaSearchController.$inject = ['GithubPersonasService', 'githubFactory'];

  function PersonaSearchController(GithubPersonasService, githubFactory) {
    var person = this;


    person.github = githubFactory;

    person.username = 'museyoucoulduse';

    console.log('instatiate')
    person.onError = function (err) {
      person.error = err.message;
      console.log(err.message);
    };

    person.onUserResponse = function (data) {
      person.user = data;
      console.log(person.user);
      person.github.getRepos(person.user).then(person.onReposResponse, person.onError);
    };

    person.onReposResponse = function (data) {
      person.repos = data;
      console.log(person.repos);
      person.addPersona();
    };

    person.search = function () {
      console.log('search');
      person.github.getUser(person.username).then(person.onUserResponse, person.onError)

    };

    person.addPersona = function () {
      GithubPersonasService.addPerson(person.user.login, person.repos, 0)
    };
  };

  PersonasShowController.$inject = ['GithubPersonasService']

  function PersonasShowController() {
    var showPersons = this

    showPersons.personas = GithubPersonasService.personas;

    showPersons.removePersona = function (index) {
      GithubPersonasService.removePerson(index);
    }
  };

  PersonaAddController.$inject = ['GithubPersonasService']

  function PersonaAddController(GithubPersonasService) {
    var personasAdder = this;

    personasAdder.login = '';
    personasAdder.repos = '';
    personasAdder.score = 0;

    personasAdder.addPersona = () => {
      GithubPersonasService.addPerson(personasAdder.login, personasAdder.repos, personasAdder.score);
    };
  };

  function GithubPersonasService() {
    var service = this;

    var personas = []

    service.addPerson = (login, repos, score) => {
      var persona = {
        login: login,
        repos: repos,
        score: score
      };
      personas.push(persona);
    };

    service.getPersonas = function () {
      console.log('reaching for people')
      return personas;
    };

    service.removePerson = function (index) {
      parsonas.splice(index, 1)
    }
    return service;
  };

  function githubFactory($http) {
    return {
      getRepos: function (user) {
        return $http.get(user.repos_url)
          .then(function (res) {
            return res.data;
            console.log('Retrived repo user data');
          });
      },
      getUser: function (login) {
        return $http.get('https://api.github.com/users/' + login)
          .then(function (res) {
            return res.data;
            console.log('Retrieved user data');
          });
      }
    }
  }

})();
