'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StaffFormDialog } from '@/features/staff/components/staff-form-dialog';
import { StaffTable } from '@/features/staff/components/staff-table';
import { useStaffList } from '@/features/staff/queries';
import { StudentFormDialog } from '@/features/students/components/student-form-dialog';
import { useStudents, useUpdateStudent } from '@/features/students/queries';
import type { Student } from '@/features/students/types';
import { ChevronLeft, ChevronRight, MoreHorizontal, Pencil, Plus, RefreshCw, Search, UserCheck, UserX } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export default function PeoplePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight">People</h2>
        <p className="text-sm text-muted-foreground">Manage students and teaching staff.</p>
      </div>

      <Tabs defaultValue="students" className="space-y-6">
        <TabsList>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
        </TabsList>
        <TabsContent value="students" className="space-y-4">
          <StudentsTab />
        </TabsContent>
        <TabsContent value="staff" className="space-y-4">
          <StaffTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StudentsTab() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debounced]);

  const { data, isLoading, isError, refetch, isFetching } = useStudents({
    page,
    limit,
    q: debounced || undefined,
  });
  const updateStudent = useUpdateStudent('');

  const rows = useMemo(() => data?.data ?? [], [data]);
  const total = data?.meta.total ?? 0;
  const pageSize = data?.meta.limit ?? limit;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const showingFrom = (page - 1) * pageSize + (rows.length ? 1 : 0);
  const showingTo = (page - 1) * pageSize + rows.length;

  const [editStudent, setEditStudent] = useState<Student | null>(null);

  return (
    <div className="space-y-4">
      <Toolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search students..."
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
        primary={
          <StudentFormDialog
            mode="create"
            trigger={
              <Button size="lg">
                <Plus />
                Add student
              </Button>
            }
          />
        }
      />

      {isError ? (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-sm text-destructive">
          Failed to load students. Please try again.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border bg-card">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-muted/40">
                <TableHead className="h-11 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Name
                </TableHead>
                <TableHead className="h-11 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Email
                </TableHead>
                <TableHead className="h-11 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Phone
                </TableHead>
                <TableHead className="h-11 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="h-11 px-4 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                [1, 2, 3].map((row) => (
                  <TableRow key={row}>
                    <TableCell className="px-4 py-3">
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Skeleton className="h-4 w-48" />
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Skeleton className="h-5 w-16" />
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <Skeleton className="h-7 w-7 ml-auto rounded-md" />
                    </TableCell>
                  </TableRow>
                ))}

              {!isLoading && rows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-12 text-center text-sm text-muted-foreground"
                  >
                    {debounced ? 'No students match your search.' : 'No students yet.'}
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                rows.map((student: Student) => (
                  <TableRow key={student.id}>
                    <TableCell className="px-4 py-3 font-medium">
                      {student.firstName} {student.lastName}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-muted-foreground">
                      {student.email}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-muted-foreground">
                      {student.phone || '—'}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {student.isActive ? (
                        <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <StudentRowMenu
                        student={student}
                        onEdit={() => setEditStudent(student)}
                        toggleStatus={() =>
                          updateStudent.mutate({
                            firstName: student.firstName,
                            lastName: student.lastName,
                            email: student.email,
                            phone: student.phone,
                            isActive: !student.isActive,
                          })
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink onClick={() => setPage(page - 1)}>
              <ChevronLeft />
            </PaginationLink>
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <PaginationItem key={p}>
              <PaginationLink onClick={() => setPage(p)}>
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationLink onClick={() => setPage(page + 1)}>
              <ChevronRight />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {editStudent && (
        <StudentFormDialog
          mode="edit"
          student={editStudent}
          open={true}
          onOpenChange={(next) => {
            if (!next) setEditStudent(null);
          }}
        />
      )}
    </div>
  );
}

function StudentRowMenu({
  student,
  onEdit,
  toggleStatus,
}: {
  student: Student;
  onEdit: () => void;
  toggleStatus: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Open actions">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            onEdit();
          }}
        >
          <Pencil />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant={student.isActive ? 'destructive' : 'default'}
          onSelect={toggleStatus}
        >
          {student.isActive ? <UserX /> : <UserCheck />}
          {student.isActive ? 'Mark inactive' : 'Mark active'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function StaffTab() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debounced]);

  const { data, isLoading, isError, isFetching, refetch } = useStaffList({
    page,
    pageSize,
    q: debounced || undefined,
  });

  const total = data?.meta.total ?? 0;
  const currentPageSize = data?.meta.pageSize ?? pageSize;
  const totalPages = Math.max(1, Math.ceil(total / currentPageSize));
  const rowCount = data?.data.length ?? 0;
  const showingFrom = (page - 1) * currentPageSize + (rowCount ? 1 : 0);
  const showingTo = (page - 1) * currentPageSize + rowCount;

  return (
    <div className="space-y-4">
      <Toolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search teachers..."
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
        primary={
          <StaffFormDialog
            mode="create"
            trigger={
              <Button size="lg">
                <Plus />
                New teacher
              </Button>
            }
          />
        }
      />

      <StaffTable
        staff={data?.data ?? []}
        isLoading={isLoading}
        isError={isError}
        emptyMessage={debounced ? 'No teachers match your search.' : 'No teachers yet.'}
      />

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                isActive={page === i + 1}
                onClick={(e) => {
                  e.preventDefault();
                  setPage(i + 1);
                }}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setPage((prev) => Math.min(prev + 1, totalPages));
            }}
          />
        </PaginationContent>
      </Pagination>
    </div>
  );
}

function Toolbar({
  search,
  onSearchChange,
  searchPlaceholder,
  onRefresh,
  isRefreshing,
  primary,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  onRefresh: () => void;
  isRefreshing?: boolean;
  primary: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="pl-8"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onRefresh} disabled={isRefreshing}>
          <RefreshCw className={isRefreshing ? 'animate-spin' : ''} />
          {isRefreshing ? 'Refreshing' : 'Refresh'}
        </Button>
        {primary}
      </div>
    </div>
  );
}
