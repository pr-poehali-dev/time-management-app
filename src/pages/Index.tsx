import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import Icon from '@/components/ui/icon';

interface Project {
  id: string;
  name: string;
  description: string;
  totalTime: number;
  isActive: boolean;
  color: string;
}

interface TimeEntry {
  projectId: string;
  date: string;
  hours: number;
}

const Index = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Дизайн интерфейса',
      description: 'Создание UI/UX для мобильного приложения',
      totalTime: 8520, // в секундах
      isActive: false,
      color: '#2563EB'
    },
    {
      id: '2',
      name: 'Разработка API',
      description: 'Backend разработка REST API',
      totalTime: 12300,
      isActive: false,
      color: '#10B981'
    },
    {
      id: '3',
      name: 'Тестирование',
      description: 'Автоматизированное тестирование',
      totalTime: 5400,
      isActive: false,
      color: '#8B5CF6'
    }
  ]);

  // Данные для аналитики
  const weeklyData = [
    { day: 'Пн', hours: 8.5 },
    { day: 'Вт', hours: 7.2 },
    { day: 'Ср', hours: 9.1 },
    { day: 'Чт', hours: 6.8 },
    { day: 'Пт', hours: 8.3 },
    { day: 'Сб', hours: 4.2 },
    { day: 'Вс', hours: 2.1 }
  ];

  const projectData = projects.map(project => ({
    name: project.name,
    hours: Math.round(project.totalTime / 3600 * 10) / 10,
    color: project.color
  }));

  // Таймер логика
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setCurrentTime(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = (projectId: string) => {
    setActiveProject(projectId);
    setIsRunning(true);
    setProjects(prev => prev.map(p => ({ ...p, isActive: p.id === projectId })));
  };

  const stopTimer = () => {
    if (activeProject) {
      setProjects(prev => prev.map(p => 
        p.id === activeProject 
          ? { ...p, totalTime: p.totalTime + currentTime, isActive: false }
          : p
      ));
    }
    setIsRunning(false);
    setActiveProject(null);
    setCurrentTime(0);
  };

  const addProject = () => {
    if (newProjectName.trim()) {
      const colors = ['#2563EB', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];
      const newProject: Project = {
        id: Date.now().toString(),
        name: newProjectName,
        description: 'Новый проект',
        totalTime: 0,
        isActive: false,
        color: colors[projects.length % colors.length]
      };
      setProjects(prev => [...prev, newProject]);
      setNewProjectName('');
    }
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (activeProject === id) {
      stopTimer();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Навигация */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Icon name="Timer" className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">TimeFlow</h1>
            </div>
            <div className="flex items-center space-x-6">
              <Button variant="ghost" size="sm">
                <Icon name="BarChart3" className="h-4 w-4 mr-2" />
                Аналитика
              </Button>
              <Button variant="ghost" size="sm">
                <Icon name="Settings" className="h-4 w-4 mr-2" />
                Настройки
              </Button>
              <Button variant="ghost" size="sm">
                <Icon name="User" className="h-4 w-4 mr-2" />
                Профиль
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="timer" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
            <TabsTrigger value="timer">Таймер</TabsTrigger>
            <TabsTrigger value="projects">Проекты</TabsTrigger>
            <TabsTrigger value="analytics">Аналитика</TabsTrigger>
            <TabsTrigger value="settings">Настройки</TabsTrigger>
          </TabsList>

          {/* Главная страница - Таймер */}
          <TabsContent value="timer" className="space-y-8">
            <div className="text-center space-y-6">
              <div className="animate-fade-in">
                <h2 className="text-4xl font-light text-muted-foreground mb-2">Текущая сессия</h2>
                <div className="text-8xl font-mono font-light text-primary mb-8">
                  {formatTime(currentTime)}
                </div>
                {activeProject && (
                  <div className="flex items-center justify-center space-x-2 mb-6">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: projects.find(p => p.id === activeProject)?.color }}
                    />
                    <span className="text-lg text-muted-foreground">
                      {projects.find(p => p.id === activeProject)?.name}
                    </span>
                  </div>
                )}
                <div className="flex justify-center space-x-4">
                  {!isRunning ? (
                    <Button size="lg" className="px-8">
                      <Icon name="Play" className="h-5 w-5 mr-2" />
                      Выбрать проект
                    </Button>
                  ) : (
                    <Button 
                      size="lg" 
                      variant="destructive" 
                      onClick={stopTimer}
                      className="px-8"
                    >
                      <Icon name="Square" className="h-5 w-5 mr-2" />
                      Остановить
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Быстрый выбор проекта */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <Card 
                  key={project.id} 
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg animate-scale-in ${
                    project.isActive ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => !isRunning && startTimer(project.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: project.color }}
                      />
                      {project.isActive && (
                        <Badge variant="default" className="animate-pulse">
                          Активен
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-mono font-medium">
                        {formatTime(project.totalTime)}
                      </span>
                      <Button 
                        size="sm" 
                        variant={project.isActive ? "destructive" : "default"}
                        disabled={isRunning && !project.isActive}
                      >
                        <Icon name={project.isActive ? "Square" : "Play"} className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Страница проектов */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Мои проекты</h2>
              <div className="flex space-x-2">
                <Input
                  placeholder="Название проекта"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-64"
                />
                <Button onClick={addProject}>
                  <Icon name="Plus" className="h-4 w-4 mr-2" />
                  Добавить
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="animate-fade-in hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                        <div>
                          <CardTitle className="text-xl">{project.name}</CardTitle>
                          <CardDescription className="mt-1">{project.description}</CardDescription>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteProject(project.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Icon name="Trash2" className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Общее время</span>
                        <span className="text-xl font-mono font-medium">
                          {formatTime(project.totalTime)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Часов</span>
                        <span className="text-lg font-medium">
                          {Math.round(project.totalTime / 3600 * 10) / 10}h
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => startTimer(project.id)}
                          disabled={isRunning}
                        >
                          <Icon name="Play" className="h-4 w-4 mr-2" />
                          Запустить
                        </Button>
                        <Button variant="outline" size="sm">
                          <Icon name="Edit" className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Аналитика */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-3xl font-bold">Аналитика времени</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* График по дням недели */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Активность по дням</CardTitle>
                  <CardDescription>Часы работы за последнюю неделю</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      hours: {
                        label: "Часы",
                        color: "hsl(var(--primary))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="hours" fill="var(--color-hours)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Распределение по проектам */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Распределение времени</CardTitle>
                  <CardDescription>По проектам за весь период</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      hours: {
                        label: "Часы",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={projectData}
                          dataKey="hours"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={({ name, value }) => `${name}: ${value}h`}
                        >
                          {projectData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Статистика */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Общая статистика</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Всего проектов</span>
                    <span className="text-2xl font-bold">{projects.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Общее время</span>
                    <span className="text-2xl font-bold">
                      {Math.round(projects.reduce((sum, p) => sum + p.totalTime, 0) / 3600 * 10) / 10}h
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Среднее время на проект</span>
                    <span className="text-2xl font-bold">
                      {projects.length > 0 
                        ? Math.round(projects.reduce((sum, p) => sum + p.totalTime, 0) / projects.length / 3600 * 10) / 10
                        : 0}h
                    </span>
                  </div>
                  <div className="pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Цель недели: 40 часов</span>
                      <span className="text-sm font-medium">
                        {Math.round(weeklyData.reduce((sum, day) => sum + day.hours, 0) * 10) / 10}h
                      </span>
                    </div>
                    <Progress 
                      value={(weeklyData.reduce((sum, day) => sum + day.hours, 0) / 40) * 100} 
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Активность по времени */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Тренд продуктивности</CardTitle>
                  <CardDescription>Динамика работы за месяц</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      hours: {
                        label: "Часы",
                        color: "hsl(var(--accent))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line 
                          type="monotone" 
                          dataKey="hours" 
                          stroke="var(--color-hours)" 
                          strokeWidth={3}
                          dot={{ fill: "var(--color-hours)", strokeWidth: 2, r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Настройки */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-3xl font-bold">Настройки аккаунта</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Профиль пользователя</CardTitle>
                  <CardDescription>Основная информация о вашем аккаунте</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Имя пользователя</label>
                    <Input defaultValue="Алексей Петров" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input defaultValue="alex@example.com" type="email" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Часовой пояс</label>
                    <Input defaultValue="UTC+3 (Москва)" />
                  </div>
                  <Button className="w-full">
                    <Icon name="Save" className="h-4 w-4 mr-2" />
                    Сохранить изменения
                  </Button>
                </CardContent>
              </Card>

              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Уведомления</CardTitle>
                  <CardDescription>Настройте предпочтения уведомлений</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Email уведомления</label>
                      <p className="text-xs text-muted-foreground">Получать отчеты на email</p>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Напоминания о перерывах</label>
                      <p className="text-xs text-muted-foreground">Уведомления каждые 25 минут</p>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Темная тема</label>
                      <p className="text-xs text-muted-foreground">Автоматическое переключение</p>
                    </div>
                    <input type="checkbox" className="toggle" />
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Экспорт данных</CardTitle>
                  <CardDescription>Скачайте данные о времени работы</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full">
                    <Icon name="Download" className="h-4 w-4 mr-2" />
                    Скачать CSV отчет
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Icon name="FileText" className="h-4 w-4 mr-2" />
                    Экспорт в PDF
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Icon name="Calendar" className="h-4 w-4 mr-2" />
                    Синхронизация с календарем
                  </Button>
                </CardContent>
              </Card>

              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Опасная зона</CardTitle>
                  <CardDescription>Необратимые действия с аккаунтом</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="destructive" className="w-full">
                    <Icon name="Trash2" className="h-4 w-4 mr-2" />
                    Удалить все данные
                  </Button>
                  <Button variant="destructive" className="w-full">
                    <Icon name="UserX" className="h-4 w-4 mr-2" />
                    Удалить аккаунт
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;