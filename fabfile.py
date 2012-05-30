from fabric.api import *
import os,shutil,sys,time,getpass,time

JOSHFIRE_FRAMEWORK_PATH = "../joshfire-framework/"

sys.path.append(JOSHFIRE_FRAMEWORK_PATH+"build")
from joshfabric import setup_remote_environment,upload_tar_from_export,symlink_current_release,optimize,compile

try:
    import json
except:
    import simplejson as json

packageconf = json.load(open("package.json", "r"))

env.export_dir = os.path.join(os.path.dirname(__file__), "export")

def prod():
    "Use prod environment"
    env.hosts = ['88.190.234.126']
    env.path = '/home/joshfire/exports/%s' % (packageconf["name"])
    env.user = 'joshfire'


def deploy():
    "Deploys, currently in dev mode"
    env.release = time.strftime('%Y%m%d%H%M%S')
    export()
    setup_remote_environment()
    upload_tar_from_export()
    run('source /home/joshfire/.nvm/nvm.sh ; nvm use v0.4.12 ; cd %s/releases/%s ; npm install' % (env.path, env.release))
    symlink_current_release()
    run("source /home/joshfire/.nvm/nvm.sh ; nvm use v0.4.12 ; cd %s/releases/%s; forever stop joshfire/adapters/node/bootstrap.js; forever start joshfire/adapters/node/bootstrap.js" % (env.path, env.release))


def export():
    templates()
    scss()
    joshbuild()
    optimize()
    
    compiledstamp = int(time.time())
    
    local("mkdir -p %s" % (env.export_dir))
    local("mkdir -p public/js/")
    
    local("rm -rf %s/*" % (env.export_dir))
    local("cp -RL public %s/" % (env.export_dir))

    local("cp -a fab_helpers %s" % (env.export_dir))

    compile("export-optimized/")
    
    for js in os.listdir("export-optimized/"):
      
      local("cp export-optimized/%s %s/public/js/%s.%s%s" % (js,env.export_dir,js[0:-3],compiledstamp,js[-3:]))

    for f in ["node.cli.js","package.json","src","templates_compiled","joshfire"]:
      local("cp -RL %s %s/" % (f,env.export_dir))
    local("cp -a main.js %s/" % (env.export_dir))

    cnt = open(os.path.join(env.export_dir,"node.cli.js"),"r").read()
    f = open(os.path.join(env.export_dir,"node.cli.js"),"w")
    f.write("Joshfire.compiled=%s;"%(compiledstamp)+cnt)
    f.close()
    
def joshbuild():
    pass
    
def serve():
    scss()
    templates()
    joshbuild()
    local("node joshfire/adapters/node/bootstrap.js node.cli.js")

def scss():
    local("sass --scss --update public/css:public/css")

def templates():
    local("node joshfire/adapters/node/bootstrap.js joshfire/adapters/node/utils/templatecompiler.cli.js templates/ "+os.path.join(os.getcwd(),"templates_compiled"))
