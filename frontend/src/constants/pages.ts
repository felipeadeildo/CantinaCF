export const SIDEBAR_PAGES = [
  { name: "Perfil", path: "/profile", category: "Páginas" },
  { name: "Comprar Produtos", path: "/cantina/buy", category: "Páginas" },
  { name: "Recarregar Saldo", path: "/cantina/recharge", category: "Páginas" },
  { name: "Home", path: "/", category: "Páginas" },
  { name: "Usuários", path: "/admin/users", category: "Administração" },
  { name: "Produtos", path: "/admin/products", category: "Administração" },
  { name: "Despachar Produtos", path: "/cantina/dispatch", category: "Administração" },
  {
    name: "Liberar Recargas",
    path: "/admin/payments",
    category: "Administração",
  },
  {
    name: "Liquidar Folha de Pagamento",
    path: "/admin/settle-payroll",
    category: "Administração",
  },
  { name: "Histórico de Recargas", path: "/audits/recharges", category: "Auditorias" },
  { name: "Histórico de Compras", path: "/audits/sales", category: "Auditorias" },
]

export const SIDEBAR_PAGES_CATEGORIES = ["Páginas", "Administração", "Auditorias"]
