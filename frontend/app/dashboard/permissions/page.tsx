'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/api';
import { useLocale } from '@/lib/i18n';
import { useRole, canAccess, type Role, type Permission } from '@/lib/rbac';

/* ── Types ──────────────────────────────────────────────────────── */

type OrgMember = { id: number; user_id: number; email: string; full_name: string; role: string };

/* ── Constants ──────────────────────────────────────────────────── */

const ROLES: { value: Role; color: string }[] = [
  { value: 'owner',  color: '#f59e0b' },
  { value: 'admin',  color: '#a78bfa' },
  { value: 'member', color: '#38bdf8' },
  { value: 'viewer', color: '#6b7280' },
];

const PERMISSIONS: { key: Permission; labelKey: string }[] = [
  { key: 'tasks:read',          labelKey: 'permissions.perm.tasksRead' },
  { key: 'tasks:write',         labelKey: 'permissions.perm.tasksWrite' },
  { key: 'integrations:manage', labelKey: 'permissions.perm.integrations' },
  { key: 'team:manage',         labelKey: 'permissions.perm.team' },
  { key: 'billing:manage',      labelKey: 'permissions.perm.billing' },
  { key: 'org:manage',          labelKey: 'permissions.perm.org' },
  { key: 'roles:manage',        labelKey: 'permissions.perm.roles' },
];

const NAV_ITEMS: { labelKey: string; permission?: Permission }[] = [
  { labelKey: 'nav.overview' },
  { labelKey: 'nav.office' },
  { labelKey: 'nav.tasks',         permission: 'tasks:read' },
  { labelKey: 'nav.sprints',       permission: 'tasks:read' },
  { labelKey: 'nav.team',          permission: 'team:manage' },
  { labelKey: 'nav.agents' },
  { labelKey: 'nav.flows' },
  { labelKey: 'nav.templates' },
  { labelKey: 'nav.mappings' },
  { labelKey: 'nav.integrations',  permission: 'integrations:manage' },
  { labelKey: 'nav.notifications' },
  { labelKey: 'nav.usage',         permission: 'billing:manage' },
  { labelKey: 'nav.profile' },
];

const GRADIENTS = [
  ['#0d9488','#22c55e'], ['#7c3aed','#a78bfa'], ['#0ea5e9','#38bdf8'],
  ['#f59e0b','#fb923c'], ['#ec4899','#f472b6'], ['#14b8a6','#06b6d4'],
];
const grad = (name: string) => {
  const g = GRADIENTS[name.charCodeAt(0) % GRADIENTS.length];
  return `linear-gradient(135deg, ${g[0]}, ${g[1]})`;
};
const initials = (name: string) =>
  name.split(' ').map((n) => n[0] ?? '').join('').toUpperCase().slice(0, 2);

/* ── Page Component ─────────────────────────────────────────────── */

export default function PermissionsPage() {
  const { t } = useLocale();
  const { role: myRole } = useRole();
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [changingId, setChangingId] = useState<number | null>(null);
  const [toast, setToast] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');

  const canManageRoles = canAccess(myRole, 'roles:manage');

  const fetchMembers = useCallback(async () => {
    try {
      const data = await apiFetch<OrgMember[]>('/org/members');
      setMembers(data);
    } catch { /* silent */ }
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchMembers();
    apiFetch<{ email: string }>('/auth/me').then((u) => setCurrentEmail(u.email)).catch(() => {});
  }, [fetchMembers]);

  const handleRoleChange = async (memberId: number, newRole: string) => {
    setChangingId(memberId);
    try {
      await apiFetch(`/org/members/${memberId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole }),
      });
      setMembers((prev) => prev.map((m) => m.id === memberId ? { ...m, role: newRole } : m));
      setToast(t('permissions.roleChanged'));
      setTimeout(() => setToast(''), 2000);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error';
      setToast(msg);
      setTimeout(() => setToast(''), 3000);
    }
    setChangingId(null);
  };

  return (
    <div style={{ display: 'grid', gap: 32, maxWidth: 960 }}>
      {/* Page header */}
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--ink-90)', margin: 0 }}>
          {t('permissions.title')}
        </h1>
        <p style={{ fontSize: 13, color: 'var(--ink-35)', marginTop: 6 }}>
          {t('permissions.desc')}
        </p>
      </div>

      {/* ── Section 1: Permission Matrix ───────────────────────────── */}
      <section>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-90)', marginBottom: 14 }}>
          {t('permissions.matrixTitle')}
        </h2>

        {/* Desktop table */}
        <div className="perm-matrix-desktop" style={{
          borderRadius: 14, border: '1px solid var(--panel-border)', overflow: 'hidden',
          background: 'var(--panel)',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid var(--panel-border)', color: 'var(--ink-35)', fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
                  {t('permissions.permission')}
                </th>
                {ROLES.map((r) => (
                  <th key={r.value} style={{
                    textAlign: 'center', padding: '12px 16px',
                    borderBottom: '1px solid var(--panel-border)',
                    color: r.color, fontSize: 12, fontWeight: 700,
                    background: `${r.color}10`,
                  }}>
                    {t(`permissions.role.${r.value}` as Parameters<typeof t>[0])}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMISSIONS.map((perm, i) => (
                <tr key={perm.key} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--panel-alt)' }}>
                  <td style={{ padding: '10px 16px', color: 'var(--ink-90)', fontWeight: 500, borderBottom: '1px solid var(--panel-border)' }}>
                    {t(perm.labelKey as Parameters<typeof t>[0])}
                  </td>
                  {ROLES.map((r) => {
                    const allowed = canAccess(r.value, perm.key);
                    return (
                      <td key={r.value} style={{ textAlign: 'center', padding: '10px 16px', borderBottom: '1px solid var(--panel-border)' }}>
                        {allowed ? (
                          <span style={{ color: '#22c55e', fontSize: 16, fontWeight: 700 }}>&#10003;</span>
                        ) : (
                          <span style={{ color: '#ef4444', fontSize: 14, fontWeight: 700 }}>&#10005;</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="perm-matrix-mobile" style={{ display: 'none' }}>
          <div style={{ display: 'grid', gap: 10 }}>
            {PERMISSIONS.map((perm) => (
              <div key={perm.key} style={{
                borderRadius: 14, border: '1px solid var(--panel-border)',
                background: 'var(--panel)', padding: '14px 16px',
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-90)', marginBottom: 10 }}>
                  {t(perm.labelKey as Parameters<typeof t>[0])}
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {ROLES.map((r) => {
                    const allowed = canAccess(r.value, perm.key);
                    return (
                      <span key={r.value} style={{
                        padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                        background: allowed ? `${r.color}18` : 'var(--panel-alt)',
                        color: allowed ? r.color : 'var(--ink-20)',
                        border: `1px solid ${allowed ? `${r.color}40` : 'var(--panel-border)'}`,
                      }}>
                        {t(`permissions.role.${r.value}` as Parameters<typeof t>[0])} {allowed ? '✓' : '✗'}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 2: Organization Members ────────────────────────── */}
      <section>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-90)', marginBottom: 6 }}>
          {t('permissions.membersTitle')}
        </h2>
        <p style={{ fontSize: 13, color: 'var(--ink-35)', marginBottom: 14 }}>
          {t('permissions.membersDesc')}
        </p>

        {toast && (
          <div style={{ padding: '8px 14px', borderRadius: 10, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', fontSize: 12, fontWeight: 600, marginBottom: 12 }}>
            {toast}
          </div>
        )}

        {loading ? (
          <div style={{ display: 'grid', gap: 8 }}>
            {[1, 0.7, 0.4].map((op, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, background: 'var(--panel)', opacity: op }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--panel-border-2)', flexShrink: 0 }} />
                <div style={{ flex: 1, height: 11, borderRadius: 4, background: 'var(--panel-border)' }} />
                <div style={{ width: 55, height: 18, borderRadius: 999, background: 'var(--glass)' }} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 8 }}>
            {members.map((member) => {
              const roleInfo = ROLES.find((r) => r.value === member.role) || ROLES[2];
              const isChanging = changingId === member.id;
              const isMe = member.email === currentEmail;
              return (
                <div key={member.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
                  borderRadius: 14, border: '1px solid var(--panel-border)', background: 'var(--panel)',
                  opacity: isChanging ? 0.6 : 1, transition: 'opacity 0.2s',
                }}>
                  {/* Avatar */}
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: grad(member.full_name || member.email),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 800, color: '#fff', flexShrink: 0,
                  }}>
                    {initials(member.full_name || member.email)}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-90)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      {member.full_name || member.email}
                      {isMe && (
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 999,
                          background: 'rgba(13,148,136,0.15)', color: '#0d9488',
                          border: '1px solid rgba(13,148,136,0.3)',
                        }}>
                          {t('permissions.you')}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--ink-35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {member.email}
                    </div>
                  </div>

                  {/* Role selector */}
                  {canManageRoles ? (
                    <select
                      value={member.role}
                      onChange={(e) => void handleRoleChange(member.id, e.target.value)}
                      disabled={isChanging}
                      style={{
                        padding: '6px 10px', borderRadius: 10, fontSize: 12, fontWeight: 700,
                        border: `1px solid ${roleInfo.color}40`,
                        background: `${roleInfo.color}15`, color: roleInfo.color,
                        cursor: 'pointer', outline: 'none', appearance: 'auto',
                        flexShrink: 0,
                      }}
                    >
                      {ROLES.map((r) => (
                        <option key={r.value} value={r.value}>
                          {t(`permissions.role.${r.value}` as Parameters<typeof t>[0])}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span style={{
                      padding: '5px 12px', borderRadius: 10, fontSize: 12, fontWeight: 700,
                      background: `${roleInfo.color}15`, color: roleInfo.color,
                      border: `1px solid ${roleInfo.color}40`, flexShrink: 0,
                    }}>
                      {t(`permissions.role.${member.role}` as Parameters<typeof t>[0])}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Section 3: Menu Visibility per Role ────────────────────── */}
      <section>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-90)', marginBottom: 6 }}>
          {t('permissions.menuTitle')}
        </h2>
        <p style={{ fontSize: 13, color: 'var(--ink-35)', marginBottom: 14 }}>
          {t('permissions.menuDesc')}
        </p>

        {/* Desktop table */}
        <div className="perm-menu-desktop" style={{
          borderRadius: 14, border: '1px solid var(--panel-border)', overflow: 'hidden',
          background: 'var(--panel)',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid var(--panel-border)', color: 'var(--ink-35)', fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
                  {t('permissions.menuItem')}
                </th>
                {ROLES.map((r) => (
                  <th key={r.value} style={{
                    textAlign: 'center', padding: '12px 16px',
                    borderBottom: '1px solid var(--panel-border)',
                    color: r.color, fontSize: 12, fontWeight: 700,
                    background: `${r.color}10`,
                  }}>
                    {t(`permissions.role.${r.value}` as Parameters<typeof t>[0])}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {NAV_ITEMS.map((item, i) => (
                <tr key={item.labelKey} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--panel-alt)' }}>
                  <td style={{ padding: '10px 16px', color: 'var(--ink-90)', fontWeight: 500, borderBottom: '1px solid var(--panel-border)' }}>
                    {t(item.labelKey as Parameters<typeof t>[0])}
                  </td>
                  {ROLES.map((r) => {
                    const visible = !item.permission || canAccess(r.value, item.permission);
                    return (
                      <td key={r.value} style={{ textAlign: 'center', padding: '10px 16px', borderBottom: '1px solid var(--panel-border)' }}>
                        {visible ? (
                          <span style={{ color: '#22c55e', fontSize: 16, fontWeight: 700 }}>&#10003;</span>
                        ) : (
                          <span style={{ color: '#ef4444', fontSize: 14, fontWeight: 700 }}>&#10005;</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="perm-menu-mobile" style={{ display: 'none' }}>
          <div style={{ display: 'grid', gap: 10 }}>
            {NAV_ITEMS.map((item) => (
              <div key={item.labelKey} style={{
                borderRadius: 14, border: '1px solid var(--panel-border)',
                background: 'var(--panel)', padding: '14px 16px',
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-90)', marginBottom: 10 }}>
                  {t(item.labelKey as Parameters<typeof t>[0])}
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {ROLES.map((r) => {
                    const visible = !item.permission || canAccess(r.value, item.permission);
                    return (
                      <span key={r.value} style={{
                        padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                        background: visible ? `${r.color}18` : 'var(--panel-alt)',
                        color: visible ? r.color : 'var(--ink-20)',
                        border: `1px solid ${visible ? `${r.color}40` : 'var(--panel-border)'}`,
                      }}>
                        {t(`permissions.role.${r.value}` as Parameters<typeof t>[0])} {visible ? '✓' : '✗'}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 640px) {
          .perm-matrix-desktop, .perm-menu-desktop { display: none !important; }
          .perm-matrix-mobile, .perm-menu-mobile { display: block !important; }
        }
      `}</style>
    </div>
  );
}
