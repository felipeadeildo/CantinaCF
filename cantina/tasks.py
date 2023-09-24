from . import db
from datetime import datetime
from .models import Task
from threading import Thread
from . import app
import time
import signal


class TaskManager:
    """Gerenciador de Tarefas em Background"""
    def __init__(self):
        self.task_queue = []
        self.running = False
        self.thread = Thread(target=self.__load_tasks)
        self.errors = []


    def run(self):
        """Inicia o gerenciador de tarefas"""
        if not self.running:
            self.running = True
            signal.signal(signal.SIGINT, self._signal_handler)
            self.thread.start()


    def _signal_handler(self, signum, frame):
        """Trata o sinal de interrupção"""
        print("\nSinal de interrupção recebido. Parando a thread de tarefas...")
        self.running = False
        self.thread.join()
        exit(0)


    def __load_tasks(self):
        """Carrega as tarefas do banco de dados"""
        with app.app_context():
            while True:
                if not self.running:
                    break
                try:
                    tasks = Task.query.filter_by(is_done=False).all()
                except:
                    print("Erro ao carregar tarefas.")
                    return
                self.__check_tasks(tasks)
                time.sleep(5)


    def __check_tasks(self, tasks):
        """Verifica se as tarefas devem ser executadas
        
        Args:
            tasks (list[Task]): Lista de tarefas
        """
        for task in tasks:
            if not self.running:
                break
            if task.expires_at <= datetime.now():
                self.__execute_task(task)


    def __execute_task(self, task: Task):
        """Executa uma tarefa independente de seu tipo.
        
        Args:
            task (Task): Tarefa a ser executada
        """
        runners = {
            "product_cleanup": self.__product_cleanup,
            "user_verify": self.__user_verify
        }
        runner = runners.get(task.type)
        if runner is not None:
            runner(task)
        else:
            self.errors.append(f"Task type {task.type} not found on runners map!")
            with open("errors.txt", "a+") as f:
                f.write("\n".join(self.errors))
        task.is_done = True
        task.finished_by_user_id = 1
        db.session.commit()


    def __product_cleanup(self, task: Task):
        """Executa a tarefa de limpeza de estoque
        
        Args:
            task (Task): Tarefa a ser executada
        """
        product = task.target
        product.quantity += 1


    def __user_verify(self, task: Task):
        ...