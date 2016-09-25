// Code goes here
(function () {
  'use strict';
  //  MainCtrl.$inject = [ 'github'];
  var module = angular.module('lol', [])
    .controller('PersonaSearchController', PersonaSearchController)
    .controller('PersonasShowController', PersonasShowController)
    .controller('PersonaAddController', PersonaAddController)
    .factory('githubFactory', githubFactory);

  PersonaSearchController.$inject = ['Personas', 'githubFactory'];

  function PersonaSearchController(Personas, githubFactory) {
    var person = this;
    var github = githubFactory;

    person.username = 'museyoucoulduse';


    console.log('instatiate')
    person.onError = function (err) {
      person.error = err.statusText;
      console.log(err.statusText);
    };

    person.onUserResponse = function (data) {
      person.user = data;
      person.error = null;
      console.log(person.user);
      github.getRepos(person.user).then(person.onReposResponse, person.onError);
    };

    person.onReposResponse = function (data) {
      person.repos = data;
      console.log(person.repos);
      person.addPersona();
    };

    person.search = function () {
      console.log('search');
      github.getUser(person.username).then(person.onUserResponse, person.onError)

    };

    person.addPersona = function () {
      console.log(`Adding person with data ${person.user.login} ${person.repos} and ${person.user}`);
      Personas.addPerson(person.user.login, person.repos, 0, person.user)
    };
  };

  PersonasShowController.$inject = ['Personas']

  function PersonasShowController(Personas) {
    var showPersons = this
    showPersons.clicked = false;
    showPersons.email = function () {
      showPersons.clicked = true;
    }
    showPersons.desc = function () {
      return true
    }
    console.log('getting array of persons');
    showPersons.personas = Personas.getPersonas();

    showPersons.removePersona = function (index) {
      
      Personas.removePerson(index);
    }
  };

  PersonaAddController.$inject = ['Personas']

  function PersonaAddController(Personas) {
    var personasAdder = this;

    personasAdder.login = '';
    personasAdder.repos = [];
    personasAdder.score = 0;
    personasAdder.data = {}

    personasAdder.addPersona = () => {
      Personas.addPerson(personasAdder.login, personasAdder.repos, personasAdder.score, personasAdder.data);
    };
  };


  function githubFactory($http) {
    var factory = {}
    factory.getRepos = function (user) {
      return $http.get(user.repos_url)
        .then(function (res) {
          console.log('Retrived repo user data');
          return res.data;
          
        });
    }

    factory.getUser = function (login) {
      return $http.get('https://api.github.com/users/' + login)
        .then(function (res) {
          console.log('Retrieved user data');
          return res.data;
          
        });
    }
    return factory;
  }

  module.service('Personas', function () {
    var service = this;

    var personas = []
    console.log(personas);
    service.addPerson = function (login, repos, score, data) {
      var persona = {
        login: login,
        repos: repos,
        score: score,
        data: data
      };
      var found = false;
      for(var i = 0; i < personas.length; i++) {
        if (personas[i].login == persona.login) {
          found = true;
          break;
        }
          
      }
      if (!found) {
          personas.unshift(persona);
          console.log('added person');
      }

      
    };

    service.getPersonas = function () {
      console.log('reaching for people');
      return personas;
    }

    service.removePerson = function (index) {
      personas.splice(index, 1);
    }
    return service;
  });

})();
