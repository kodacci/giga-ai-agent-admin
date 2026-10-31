def PROJECT_VERSION
def DEPLOY_GIT_SCOPE
def PACKAGE_NAME
def WEB_SERVER_IMAGE_TAG
def ESCAPED_JOB_NAME
def MARKDOWN_ESCAPE_CHARS = ['_', '*', '[', ']', '(', ')', '~', '`', '>', '#', '+', '-', '=', '|', '{', '}', '.', '!'] as Set

def escapeMd(input, escapeChars) {
    def builder = new StringBuilder()

    input.each { ch ->
        if (escapeChars.contains(ch)) {
            builder.append('\\')
        }
        builder.append(ch)
    }

    return builder.toString()
}

pipeline {
    agent { label 'linux' }

    options {
        ansiColor('xterm')
    }

    stages {
        stage('Determine version') {
            steps {
                script {
                    ESCAPED_JOB_NAME = escapeMd(JOB_NAME, MARKDOWN_ESCAPE_CHARS)
                    raTechNotify(message: "🚀 Job *${ESCAPED_JOB_NAME}* started [BUILD](${BUILD_URL}) 🚀", markdown: true)

                    nodejs(nodeJSInstallationName: 'NodeJS v24') {
                        PROJECT_VERSION =
                                sh(
                                        encoding: 'UTF-8',
                                        returnStdout: true,
                                        script: 'node -e "const pkg = require(\'./package.json\'); console.log(pkg.version)"'
                                ).trim()
                        if (!BRANCH_NAME.startsWith('release/')) {
                            PROJECT_VERSION = PROJECT_VERSION + '-SNAPSHOT'
                        }
                        DEPLOY_GIT_SCOPE =
                                sh(encoding: 'UTF-8', returnStdout: true, script: 'git name-rev --name-only HEAD')
                                        .trim()
                                        .tokenize('/')
                                        .last()
                                        .toLowerCase()
                    }

                    println "Project version: '$PROJECT_VERSION'"
                    println "Git branch scope: '$DEPLOY_GIT_SCOPE'"
                }
            }
        }

        stage('Install All Deps') {
            steps {
                script {
                    nodejs(nodeJSInstallationName: 'NodeJS v24') {
                        sh 'npm install'
                    }
                }
            }
        }

        stage('Prettier') {
            steps {
                script {
                    nodejs(nodeJSInstallationName: 'NodeJS v24') {
                        sh 'npm run pretty'
                    }
                }
            }
        }

        stage('Linter') {
            steps {
                script {
                    nodejs(nodeJSInstallationName: 'NodeJS v24') {
                        sh 'npm run lint'
                    }
                }
            }
        }

        stage('Type check') {
            steps {
                script {
                    nodejs(nodeJSInstallationName: 'NodeJS v24') {
                        sh 'npm run typecheck'
                    }
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    println('Starting running tests')
                    def logFileName = env.BUILD_TAG + '-test.log'
                    try {
                        nodejs(nodeJSInstallationName: 'NodeJS v24') {
                            sh "npm run test 2>&1 | cat > \"$logFileName\""
                        }

                        clover(
                                cloverReportDir: 'coverage',
                                cloverReportFileName: 'clover.xml',
                                healthTarget: [methodCoverage: 90, conditionalCoverage: 80, statementCoverage: 90]
                        )
                    } finally {
                        archiveArtifacts(logFileName)
                        sh "rm \"$logFileName\""
                    }
                    println 'Tests running finished'
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    nodejs(nodeJSInstallationName: 'NodeJS v24') {
                        sh 'npm run build'
                    }
                }
            }
        }

        stage('Deploy to Nexus Snapshots') {
            when {
                not {
                    branch 'release/*'
                }
            }

            steps {
                script {
                    PACKAGE_NAME = "$PROJECT_VERSION-${currentBuild.number}"
                    sh "cd build && zip -r ../${PACKAGE_NAME}.zip dist"

                    withCredentials([usernamePassword(
                            credentialsId: 'vault-nexus-deployer',
                            usernameVariable: 'USER',
                            passwordVariable: 'PASS'
                    )]) {
                        sh "curl -v --fail-with-body --user \$USER:\$PASS --upload-file ./${PACKAGE_NAME}.zip " +
                                "$NEXUS_HOST/repository/web-ui-bundle-snapshots" +
                                "/pro/ra-tech/giga-ai-agent-admin/$PROJECT_VERSION/${PACKAGE_NAME}.zip"
                    }

                    println 'Deploying to nexus finished'
                }
            }
        }

        stage('Build web server docker image') {
            steps {
                script {
                    WEB_SERVER_IMAGE_TAG = "pro.ra-tech/giga-ai-agent-admin/$DEPLOY_GIT_SCOPE/" +
                            "web-server:$PROJECT_VERSION-${currentBuild.number}"

                    docker.withServer(DOCKER_HOST, 'jenkins-client-cert') {
                        println 'Building image with tag ' + WEB_SERVER_IMAGE_TAG
                        def image = docker.build(WEB_SERVER_IMAGE_TAG, '-f Dockerfile .')

                        docker.withRegistry(SNAPSHOTS_DOCKER_REGISTRY_HOST, 'vault-nexus-deployer') {
                            image.push()
                            image.push('latest')
                        }
                    }
                }
            }
        }

        stage('Trigger deploy pipeline') {
            steps {
                script {
                    def path = BRANCH_NAME.replaceAll('/', '%2F')
                    build(
                            job: "Giga AI Agent Admin CD/$path",
                            wait: false,
                            parameters: [
                                    string(name: 'web_server_image', value: WEB_SERVER_IMAGE_TAG)
                            ]
                    )
                }
            }
        }
    }
    post {
        success {
            script{
                raTechNotify(message: "✅ Job *${ESCAPED_JOB_NAME}* completed successfully [BUILD](${BUILD_URL}) ✅", markdown: true)
            }
        }
        failure {
            script {
                raTechNotify(message: "❌ Job *${ESCAPED_JOB_NAME}* failed [BUILD](${BUILD_URL}) ❌", markdown: true)
            }
        }
        aborted {
            script {
                raTechNotify(message: "✋ Job *${ESCAPED_JOB_NAME}* aborted [BUILD](${BUILD_URL}) ✋", markdown: true)
            }
        }
    }
}
