
#!/usr/bin/env groovy

pipeline {
    agent any

    tools {nodejs 'node6.11.3'}

    environment {
        CHROME_BIN = '/usr/bin/chromium'
    }

    stages {
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'ng build --progress false --prod --aot'
            }
        }
        stage('Test') {
            steps {
                wrap([$class: 'Xvnc', takeScreenshot: false, useXauthority: true]) { 
                    sh 'ng test --progress false --watch false'
                }
            }
        }
    }

    post {
        always {
            junit '**/test-results.xml'
        }
    }
}