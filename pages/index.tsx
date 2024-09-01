import { useState } from 'react'
import { Plus, Calendar, CheckCircle, XCircle, AlertCircle, Building, Edit2, Save, LogOut, ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

type Project = {
  id: number
  name: string
  deadline: string
  status: 'ongoing' | 'completed'
  companyId: number
}

type Company = {
  id: number
  name: string
}

function PasswordForm({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'toneya12345') {
      onLogin()
      toast({
        title: "ログイン成功",
        description: "アプリケーションにアクセスできます。",
      })
    } else {
      toast({
        title: "ログイン失敗",
        description: "パスワードが間違っています。",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">パスワード入力</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">ログイン</Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default function EnterpriseProjectManager() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [projects, setProjects] = useState<Project[]>([
    { id: 1, name: "ウェブサイトリニューアル", deadline: "2023-12-31", status: "ongoing", companyId: 1 },
    { id: 2, name: "モバイルアプリ開発", deadline: "2024-03-15", status: "ongoing", companyId: 2 },
    { id: 3, name: "データ分析プロジェクト", deadline: "2023-11-30", status: "completed", companyId: 1 },
  ])
  const [companies, setCompanies] = useState<Company[]>([
    { id: 1, name: "株式会社A" },
    { id: 2, name: "株式会社B" },
  ])
  const [newProject, setNewProject] = useState({ name: '', deadline: '', companyId: '' })
  const [newCompany, setNewCompany] = useState('')
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)
  const [editingProject, setEditingProject] = useState<number | null>(null)
  const [editingCompany, setEditingCompany] = useState<number | null>(null)
  const [expandedCompanies, setExpandedCompanies] = useState<number[]>([])
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ type: 'company' | 'project', id: number } | null>(null)

  const addProject = () => {
    if (newProject.name && newProject.deadline && newProject.companyId) {
      setProjects([...projects, { ...newProject, id: Date.now(), status: 'ongoing', companyId: parseInt(newProject.companyId) }])
      setNewProject({ name: '', deadline: '', companyId: '' })
      toast({
        title: "プロジェクトが追加されました",
        description: `${newProject.name}が正常に追加されました。`,
      })
    } else {
      toast({
        title: "エラー",
        description: "すべてのフィールドを入力してください。",
        variant: "destructive",
      })
    }
  }

  const addCompany = () => {
    if (newCompany) {
      const newCompanyObj = { id: Date.now(), name: newCompany }
      setCompanies([...companies, newCompanyObj])
      setNewCompany('')
      toast({
        title: "企業が追加されました",
        description: `${newCompany}が正常に追加されました。`,
      })
    } else {
      toast({
        title: "エラー",
        description: "企業名を入力してください。",
        variant: "destructive",
      })
    }
  }

  const startEditing = (id: number) => {
    setEditingProject(id)
  }

  const startEditingCompany = (id: number) => {
    setEditingCompany(id)
  }

  const saveEdit = (id: number) => {
    const projectToEdit = projects.find(p => p.id === id)
    if (projectToEdit) {
      if (!projectToEdit.name || !projectToEdit.deadline) {
        toast({
          title: "エラー",
          description: "案件名と納期は必須です。",
          variant: "destructive",
        })
        return
      }
      setProjects(projects.map(project =>
        project.id === id ? { ...projectToEdit } : project
      ))
      setEditingProject(null)
      toast({
        title: "プロジェクトが更新されました",
        description: `${projectToEdit.name}が正常に更新されました。`,
      })
    }
  }

  const saveCompanyEdit = (id: number) => {
    const companyToEdit = companies.find(c => c.id === id)
    if (companyToEdit) {
      if (!companyToEdit.name) {
        toast({
          title: "エラー",
          description: "企業名は必須です。",
          variant: "destructive",
        })
        return
      }
      setCompanies(companies.map(company =>
        company.id === id ? { ...companyToEdit } : company
      ))
      setEditingCompany(null)
      toast({
        title: "企業名が更新されました",
        description: `企業名が${companyToEdit.name}に更新されました。`,
      })
    }
  }

  const deleteCompany = (id: number) => {
    setCompanies(companies.filter(company => company.id !== id))
    setProjects(projects.filter(project => project.companyId !== id))
    toast({
      title: "企業が削除されました",
      description: "関連するプロジェクトも削除されました。",
    })
    setDeleteConfirmation(null)
  }

  const deleteProject = (id: number) => {
    setProjects(projects.filter(project => project.id !== id))
    toast({
      title: "プロジェクトが削除されました",
      description: "プロジェクトが正常に削除されました。",
    })
    setDeleteConfirmation(null)
  }

  const isNearDeadline = (deadline: string) => {
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7 && diffDays > 0
  }

  const toggleCompanyExpansion = (companyId: number) => {
    setExpandedCompanies(prev =>
      prev.includes(companyId)
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId]
    )
  }

  const filteredCompanies = selectedCompany
    ? companies.filter(company => company.id.toString() === selectedCompany)
    : companies

  if (!isAuthenticated) {
    return <PasswordForm onLogin={() => setIsAuthenticated(true)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-sm shadow-xl">
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-bold tracking-tight text-gray-900">企業別納期管理アプリ</CardTitle>
            <Button onClick={() => setIsAuthenticated(false)} variant="outline" className="flex items-center">
              <LogOut className="mr-2 h-4 w-4" />
              ログアウト
            </Button>
          </div>
          <p className="text-gray-500">複数企業のプロジェクト進捗を効率的に管理</p>
        </CardHeader>
        <CardContent>
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            <Input
              placeholder="案件名"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              className="flex-grow"
            />
            <Input
              type="date"
              value={newProject.deadline}
              onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
              className="w-40"
            />
            <Select onValueChange={(value) => setNewProject({ ...newProject, companyId: value })}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="企業を選択" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id.toString()}>{company.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addProject} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="mr-2 h-4 w-4" /> 案件追加
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Building className="mr-2 h-4 w-4" /> 新規企業追加
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新規企業追加</DialogTitle>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="企業名"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                  />
                  <Button onClick={addCompany}>追加</Button>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>
          <div className="mb-4">
            <Select onValueChange={setSelectedCompany}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="企業でフィルター" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">全企業</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id.toString()}>{company.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-4">
            {filteredCompanies.map((company) => (
              <Collapsible
                key={company.id}
                open={expandedCompanies.includes(company.id)}
                onOpenChange={() => toggleCompanyExpansion(company.id)}
              >
                <Card>
                  <CardHeader>
                    <CollapsibleTrigger asChild>
                      <div className="flex justify-between items-center cursor-pointer">
                        <CardTitle className="text-xl font-semibold flex items-center">
                          {editingCompany === company.id ? (
                            <Input
                              value={company.name}
                              onChange={(e) => {
                                const newCompanies = [...companies];
                                const index = newCompanies.findIndex(c => c.id === company.id);
                                newCompanies[index] = { ...newCompanies[index], name: e.target.value };
                                setCompanies(newCompanies);
                              }}
                              onBlur={() => saveCompanyEdit(company.id)}
                            />
                          ) : (
                            <span onClick={() => startEditingCompany(company.id)} className="cursor-pointer hover:underline">
                              {company.name}
                            </span>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmation({ type: 'company', id: company.id });
                            }}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </CardTitle>
                        {expandedCompanies.includes(company.id) ? <ChevronUp /> : <ChevronDown />}
                      </div>
                    </CollapsibleTrigger>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-1/4">案件名</TableHead>
                            <TableHead className="w-1/4">納期</TableHead>
                            <TableHead className="w-1/4">ステータス</TableHead>
                            <TableHead className="w-1/4">アクション</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <AnimatePresence>
                            {projects.filter(project => project.companyId === company.id).map((project) => (
                              <motion.tr
                                key={project.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                              >
                                <TableCell>
                                  {editingProject === project.id ? (
                                    <Input
                                      value={project.name}
                                      onChange={(e) => {
                                        const newProjects = [...projects];
                                        const index = newProjects.findIndex(p => p.id === project.id);
                                        newProjects[index] = { ...newProjects[index], name: e.target.value };
                                        setProjects(newProjects);
                                      }}
                                    />
                                  ) : (
                                    project.name
                                  )}
                                </TableCell>
                                <TableCell>
                                  {editingProject === project.id ? (
                                    <Input
                                      type="date"
                                      value={project.deadline}
                                      onChange={(e) => {
                                        const newProjects = [...projects];
                                        const index = newProjects.findIndex(p => p.id === project.id);
                                        newProjects[index] = { ...newProjects[index], deadline: e.target.value };
                                        setProjects(newProjects);
                                      }}
                                    />
                                  ) : (
                                    <div className="flex items-center">
                                      <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                                      <span className={isNearDeadline(project.deadline) ? "text-red-500 font-semibold" : ""}>
                                        {project.deadline}
                                      </span>
                                      {isNearDeadline(project.deadline) && (
                                        <AlertCircle className="ml-2 h-4 w-4 text-red-500" />
                                      )}
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {editingProject === project.id ? (
                                    <Select
                                      value={project.status}
                                      onValueChange={(value) => {
                                        const newProjects = [...projects];
                                        const index = newProjects.findIndex(p => p.id === project.id);
                                        newProjects[index] = { ...newProjects[index], status: value as 'ongoing' | 'completed' };
                                        setProjects(newProjects);
                                      }}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="ongoing">進行中</SelectItem>
                                        <SelectItem value="completed">完了</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                      project.status === 'ongoing' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                    }`}>
                                      {project.status === 'ongoing' ? '進行中' : '完了'}
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    {editingProject === project.id ? (
                                      <Button
                                        variant="ghost"
                                        onClick={() => saveEdit(project.id)}
                                        className="text-green-500 hover:text-green-600"
                                      >
                                        <Save className="h-5 w-5" />
                                      </Button>
                                    ) : (
                                      <Button
                                        variant="ghost"
                                        onClick={() => startEditing(project.id)}
                                        className="text-blue-500 hover:text-blue-600"
                                      >
                                        <Edit2 className="h-5 w-5" />
                                      </Button>
                                    )}
                                    <Button
                                      variant="ghost"
                                      onClick={() => setDeleteConfirmation({ type: 'project', id: project.id })}
                                      className="text-red-500 hover:text-red-600"
                                    >
                                      <Trash2 className="h-5 w-5" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </motion.tr>
                            ))}
                          </AnimatePresence>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 削除確認ダイアログ */}
      <Dialog open={!!deleteConfirmation} onOpenChange={() => setDeleteConfirmation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>削除の確認</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {deleteConfirmation?.type === 'company'
              ? '本当にこの企業を削除しますか？関連するすべてのプロジェクトも削除されます。'
              : 'このプロジェクトを削除してもよろしいですか？'}
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmation(null)}>キャンセル</Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteConfirmation?.type === 'company') {
                  deleteCompany(deleteConfirmation.id);
                } else {
                  deleteProject(deleteConfirmation!.id);
                }
              }}
            >
              削除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
