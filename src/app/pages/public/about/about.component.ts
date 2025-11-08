import { Component } from '@angular/core';
import { SHARED_MODULES } from '../../../core/common/shared-module';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [SHARED_MODULES],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent {
  skillCategories = [
    {
      title: 'Frontend Mastery ⚡',
      accent: '#f58b49',
      icon: 'fa-laptop-code',
      skills: [
        { img: 'angular.svg', name: 'Angular' },
        { img: 'js.svg', name: 'JavaScript' },
        { img: 'html.svg', name: 'HTML5' },
        { img: 'css.svg', name: 'SCSS & CSS3' },
        { img: 'bootstrap.svg', name: 'Bootstrap' },
        { img: 'material.svg', name: 'Angular Material' },
        { img: 'devextreme.svg', name: 'DevExtreme' },
      ],
    },
    {
      title: 'Backend & API Engineering 🔧',
      accent: '#f58b49',
      icon: 'fa-server',
      skills: [
        { img: 'nodejs.svg', name: 'Node.js' },
        { img: 'dotnet.svg', name: '.NET Core' },
        { img: 'restapi.svg', name: 'REST API' },
      ],
    },
    {
      title: 'Database & Dev Tools 🧠',
      accent: '#f58b49',
      icon: 'fa-database',
      skills: [
        { img: 'mongodb.svg', name: 'MongoDB' },
        { img: 'mysql.svg', name: 'MySQL' },
        { img: 'swagger.svg', name: 'Swagger' },
        { img: 'postman.svg', name: 'Postman' },
        { img: 'vscode.svg', name: 'VS Code' },
        { img: 'visualstudio.svg', name: 'Visual Studio' },
        { img: 'git.svg', name: 'Git & GitHub' },
      ],
    },
  ];
}
