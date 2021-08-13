package com.mizhousoft.bmc.role.service.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.mizhousoft.bmc.BMCException;
import com.mizhousoft.bmc.role.domain.Permission;
import com.mizhousoft.bmc.role.domain.Role;
import com.mizhousoft.bmc.role.domain.RolePermission;
import com.mizhousoft.bmc.role.service.PermissionService;
import com.mizhousoft.bmc.role.service.RolePermissionService;
import com.mizhousoft.bmc.role.service.RoleService;
import com.mizhousoft.bmc.role.service.RoleViewService;

/**
 * 角色视图服务
 *
 * @version
 */
@Service
public class RoleViewServiceImpl implements RoleViewService
{
	@Autowired
	private RolePermissionService rolePermissionService;

	@Autowired
	private PermissionService permissionService;

	@Autowired
	private RoleService roleService;

	/**
	 * {@inheritDoc}
	 */
	@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
	@Override
	public void addRole(Role role, List<Permission> perms) throws BMCException
	{
		roleService.addRole(role);

		for (Permission perm : perms)
		{
			RolePermission rp = new RolePermission();
			rp.setRoleName(role.getName());
			rp.setPermName(perm.getName());
			rolePermissionService.addRolePermission(rp);
		}
	}

	/**
	 * {@inheritDoc}
	 */
	@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
	@Override
	public void modifyRole(Role role, List<Permission> perms) throws BMCException
	{
		roleService.modifyRole(role);

		rolePermissionService.deleteByRoleName(role.getName());
		for (Permission perm : perms)
		{
			RolePermission rp = new RolePermission();
			rp.setRoleName(role.getName());
			rp.setPermName(perm.getName());
			rolePermissionService.addRolePermission(rp);
		}
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public List<String> getRoleNamesByPath(String requestPath)
	{
		Permission perm = permissionService.queryByRequestPath(requestPath);
		if (null == perm)
		{
			return Collections.emptyList();
		}

		List<RolePermission> rps = rolePermissionService.queryByPermName(perm.getName());

		List<String> roleNames = new ArrayList<String>(rps.size());
		rps.forEach(item -> roleNames.add(item.getRoleName()));

		return roleNames;
	}
}
