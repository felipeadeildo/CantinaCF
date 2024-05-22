import {
  BarChartIcon,
  ClipboardIcon,
  DollarSignIcon,
  HomeIcon,
  PackageIcon,
  PercentIcon,
  ShoppingCartIcon,
  UserIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react"

export const SIDEBAR_PAGES = [
  {
    name: "Perfil",
    path: "/profile",
    category: "Cantina",
    icon: UserIcon,
    allowed_roles: [1, 2, 3, 4],
  },
  {
    name: "Comprar Produtos",
    path: "/cantina/buy",
    category: "Cantina",
    icon: ShoppingCartIcon,
    allowed_roles: [1, 2, 3, 4],
  },
  {
    name: "Recarregar Saldo",
    path: "/cantina/recharge",
    category: "Cantina",
    icon: DollarSignIcon,
    allowed_roles: [1, 2, 3, 4],
  },
  {
    name: "Usuários",
    path: "/admin/users",
    category: "Administração",
    icon: UsersIcon,
    allowed_roles: [1],
  },
  {
    name: "Produtos",
    path: "/admin/products",
    category: "Administração",
    icon: PackageIcon,
    allowed_roles: [1, 4],
  },
  {
    name: "Despachar Produtos",
    path: "/cantina/dispatch",
    category: "Administração",
    icon: ClipboardIcon,
    allowed_roles: [1, 4],
  },
  {
    name: "Liberar Recargas",
    path: "/admin/payments",
    category: "Administração",
    icon: WalletIcon,
    allowed_roles: [1, 4],
  },
  {
    name: "Liquidar Folha de Pagamento",
    path: "/admin/settle-payroll",
    category: "Administração",
    icon: PercentIcon,
    allowed_roles: [1, 4],
  },
  {
    name: "Histórico de Recargas",
    path: "/audits/recharges",
    category: "Auditorias",
    icon: ClipboardIcon,
    allowed_roles: [1, 4],
  },
  {
    name: "Histórico de Compras",
    path: "/audits/sales",
    category: "Auditorias",
    icon: ClipboardIcon,
    allowed_roles: [1, 4],
  },
  {
    name: "Estatísticas",
    path: "/admin/stats",
    category: "Auditorias",
    icon: BarChartIcon,
    allowed_roles: [1, 2, 4],
  },
  {
    name: "Afiliados",
    path: "/affiliations",
    category: "Cantina",
    icon: UsersIcon,
    allowed_roles: [1, 2, 4],
  },
]

export const SIDEBAR_PAGES_CATEGORIES = ["Cantina", "Administração", "Auditorias"]
